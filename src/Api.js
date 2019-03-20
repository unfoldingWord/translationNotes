import {ToolApi} from 'tc-tool';
import path from 'path-extra';
import usfm from "usfm-js";
import fs from 'fs-extra';
import {checkSelectionOccurrences} from 'selections';
import {getGroupDataForVerse} from './helpers/groupDataHelpers';
import {generateTimestamp, sameContext, getSelectionsFromChapterAndVerseCombo} from './helpers/validationHelpers';

export default class Api extends ToolApi {

  constructor() {
    super();
    this.getAlignmentMemory = this.getAlignmentMemory.bind(this);
    this.getInvalidChecks = this.getInvalidChecks.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this._loadBookSelections = this._loadBookSelections.bind(this);
    this._loadVerseSelections = this._loadVerseSelections.bind(this);
    this._loadCheckData = this._loadCheckData.bind(this);
  }

  /**
   * Lifecycle method
   */
  toolWillConnect() {
    this.validateBook(this.props);
  }

  validateBook() {
    const {
      tc: {
        targetBook
      }
    } = this.props;
    for (const chapter of Object.keys(targetBook)) {
      if (isNaN(chapter) || parseInt(chapter) === -1) continue;
      this.validateChapter(chapter);
    }
  }

  /**
 * verifies all the selections for chapter to make sure they are still valid.
 * This expects the book resources to have already been loaded.
 * Books are loaded when a project is selected.
 * @param {String} chapter
 */
  validateChapter(chapter) {
    const {
      tc: {
        targetBook
      }
    } = this.props;
    if (targetBook[chapter]) {
      const bibleChapter = targetBook[chapter];
      if (bibleChapter) {
        for (let verse of Object.keys(bibleChapter)) {
          const targetVerse = bibleChapter[verse];
          this._validateVerse(targetVerse, chapter, verse);
        }
      }
    }
  }

  validateVerse(chapter, verse) {
    const {
      tc: {
        targetBook
      }
    } = this.props;
    const bibleChapter = targetBook[chapter];
    const targetVerse = bibleChapter[verse];
    this._validateVerse(targetVerse, chapter, verse);
  }

  /**
  * verify all selections for current verse
  * @param {number} chapter
  * @param {number} verse
  * @return {Function}
  */
  _validateVerse(targetVerse, chapter, verse) {
    let {
      tc: {
        contextId: {reference: {bookId}},
        username: userName,
        project: {
          getGroupsData,
          _projectPath: projectSaveLocation
        }
      },
      tool: {name}
    } = this.props;
    const contextId = {
      reference: {
        bookId,
        chapter: parseInt(chapter),
        verse: parseInt(verse)
      }
    };
    const groupsDataForVerse = getGroupDataForVerse(getGroupsData, contextId, name);
    let filtered = null;
    let selectionsChanged = false;
    for (let groupItemKey of Object.keys(groupsDataForVerse)) {
      const groupItem = groupsDataForVerse[groupItemKey];
      for (let checkingOccurrence of groupItem) {
        const selections = checkingOccurrence.selections;
        if (!sameContext(contextId, checkingOccurrence.contextId)) {
          if (selections && selections.length) {
            if (!filtered) {  // for performance, we filter the verse only once and only if there is a selection
              filtered = usfm.removeMarker(targetVerse); // remove USFM markers
            }
            const validSelections = checkSelectionOccurrences(filtered, selections);
            if (selections.length !== validSelections.length) {
              const selectionsObject = getSelectionsFromChapterAndVerseCombo(
                bookId,
                chapter,
                verse,
                projectSaveLocation,
                checkingOccurrence.contextId.quote
              );
              //If selections are changed, they need to be clearded
              selectionsChanged = true;
              const invalidatedCheckPath = path.join(projectSaveLocation, '.apps', 'translationCore', 'checkData', 'invalidated', bookId, chapter.toString(), verse.toString());
              const invalidatedPayload = {
                ...selectionsObject,
                invalidated: true,
                selections: [],
                userName
              };
              this.writeCheckData(invalidatedPayload, invalidatedCheckPath);

              const selectionsCheckPath = path.join(projectSaveLocation, '.apps', 'translationCore', 'checkData', 'selections', bookId, chapter.toString(), verse.toString());
              const selectionsPayload = {
                ...selectionsObject,
                selections: [],
                userName
              };
              this.writeCheckData(selectionsPayload, selectionsCheckPath);
            }
          }
        }
      }
    }

    if (selectionsChanged) {
      this._showResetDialog();
    }
  }

  writeCheckData(payload = {}, checkPath) {
    const modifiedTimestamp = generateTimestamp();
    const newFilename = modifiedTimestamp + '.json';
    payload.modifiedTimestamp = modifiedTimestamp;
    fs.outputJSONSync(path.join(checkPath, newFilename.replace(/[:"]/g, '_')), payload);
  }


  /**
 * Returns the percent progress of completion for the project.
 * @param {string[]} selectedCategories -  an array of categories to include in the calculation.
 * @returns {number} - a value between 0 and 1
 */
  getProgress(selectedCategories) {
    const {tc: {project}, tool: {name}} = this.props;
    let totalChecks = 0;
    let completedChecks = 0;

    for (const category of selectedCategories) {
      const groups = project.getCategoryGroupIds(name, category);
      for (const group of groups) {
        const data = project.getGroupData(name, group);
        if (data && data.constructor === Array) {
          for (const check of data) {
            totalChecks++;
            completedChecks += check.selections ? 1 : 0;
          }
        } else {
          console.warn(`Invalid group data found for "${group}"`);
        }
      }
    }

    if (totalChecks === 0) {
      return 0;
    } else {
      return completedChecks / totalChecks;
    }
  }

  /**
   * Lifecycle method
   * @param nextState
   * @param prevState
   */
  stateChangeThrottled(nextState, prevState) {
    // TODO: implement
  }

  /**
   * Lifecycle method
   * @param state
   * @param props
   */
  mapStateToProps(state, props) {
    // TODO: implement
  }

  /**
   * Lifecycle method
   * @param dispatch
   */
  mapDispatchToProps(dispatch) {
    // TODO: implement
    return {};
  }

  /**
   * Lifecycle method
   */
  toolWillDisconnect() {
    // TODO: implement
  }

  toolWillReceiveProps(nextProps) {
    // TODO: implement
  }

  /**
   * Loads the most recent check data for the context id
   * @param {string} check - the check to look up e.g. "invalidated"
   * @param {object} contextId - the context id for the check to look up
   * @returns {object|null} - the check data record or null if one cannot be found
   * @private
   */
  _loadCheckData(check, contextId) {
    const {tc: {project}} = this.props;
    const {reference: {bookId, chapter, verse}, groupId, quote, occurrence} = contextId;
    const loadPath = path.join('checkData', check, bookId, `${chapter}`,
      `${verse}`);

    if (project.dataPathExistsSync(loadPath)) {
      // sort and filter check records
      const files = project.readDataDirSync(loadPath).filter(file => {
        return path.extname(file) === '.json';
      });
      let sortedRecords = files.sort().reverse();

      // load check data
      for (let i = 0, len = sortedRecords.length; i < len; i++) {
        const record = sortedRecords[i];
        const recordPath = path.join(loadPath, record);
        try {
          const recordData = JSON.parse(project.readDataFileSync(recordPath));

          // return first match
          if (recordData.contextId.groupId === groupId &&
            recordData.contextId.quote === quote &&
            recordData.contextId.occurrence === occurrence) {
            return recordData;
          }
        } catch (e) {
          console.warn(`Failed to load check record from ${recordPath}`, e);
        }
      }
    }

    return null;
  }

  /**
   * Returns the total number of invalided checks
   * TODO: move category selection management into the tool so we don't need this param
   * @param {string[]} selectedCategories - an array of categories to include in the calculation.
   * @returns {number} - the number of invalid checks
   */
  getInvalidChecks(selectedCategories) {
    const {tc: {project}, tool: {name}} = this.props;
    let invalidChecks = 0;
    for (const category of selectedCategories) {
      const groups = project.getCategoryGroupIds(name, category);
      for (const group of groups) {
        const data = project.getGroupData(name, group);
        if (data && data.constructor === Array) {
          for (const check of data) {
            const checkData = this._loadCheckData('invalidated',
              check.contextId);
            if (checkData && checkData.invalidated === true) {
              invalidChecks++;
            }
          }
        } else {
          console.warn(`Invalid group data found for "${group}"`);
        }
      }
    }
    return invalidChecks;
  }

  /**
   * Returns the alignment memory generated from selections made in tW.
   * @return {{sourceText : string, targetText : string}[]}
   */
  getAlignmentMemory() {
    // TODO: perform initial selection loading when the tool connects.
    // This must wait until after all selection logic is migrated to tW.
    const selections = this._loadBookSelections(this.props);
    const alignmentMemory = [];

    // format selections as alignment memory
    for (const chapter of Object.keys(selections)) {
      for (const verse of Object.keys(selections[chapter])) {
        for (const selection of selections[chapter][verse]) {
          if (selection.selections.length === 0) continue;
          const sourceText = selection.contextId.quote;
          const targetText = selection.selections.map(s => s.text).join(' ');
          alignmentMemory.push({
            sourceText,
            targetText
          });
        }
      }
    }

    return alignmentMemory;
  }

  /**
   * Loads the selection data for the entire book
   * @param props
   * @private
   */
  _loadBookSelections(props) {
    const {
      tc: {
        targetBook
      }
    } = props;

    const selections = {};
    for (const chapter of Object.keys(targetBook)) {
      for (const verse of Object.keys(targetBook[chapter])) {
        const verseSelections = this._loadVerseSelections(chapter, verse,
          props);
        if (verseSelections.length > 0) {
          if (!selections[chapter]) {
            selections[chapter] = {};
          }
          selections[chapter][verse] = verseSelections;
        }
      }
    }
    // TODO: store selection data in tool reducer.
    return selections;
  }

  /**
   * Loads the selection data for a verse
   * @param {string} chapter
   * @param {string} verse
   * @param props
   * @return {Array}
   * @private
   */
  _loadVerseSelections(chapter, verse, props) {
    const {
      tc: {
        contextId: {reference: {bookId}},
        projectDataPathExistsSync,
        readProjectDataSync,
        readProjectDataDirSync
      }
    } = props;

    const verseDir = path.join('checkData/selections/', bookId, chapter, verse);
    const selections = [];
    const foundSelections = [];
    if (projectDataPathExistsSync(verseDir)) {

      let files = readProjectDataDirSync(verseDir);
      files = files.filter(f => path.extname(f) === '.json');
      files = files.sort().reverse();
      for (let i = 0; i < files.length; i++) {
        let filePath = path.join(verseDir, files[i]);

        let data;
        try {
          data = JSON.parse(readProjectDataSync(filePath));
        } catch (err) {
          console.error(`failed to read selection data from ${filePath}`, err);
          continue;
        }

        if (data && data.contextId) {
          const id = `${data.contextId.groupId}:${data.contextId.quote}`;
          if (foundSelections.indexOf(id) === -1) {
            foundSelections.push(id);
            selections.push(data);
          }
        }
      }
    }
    return selections;
  }

  _showResetDialog() {
    const {
      tool: {
        translate
      }
    } = this.props;
    this.props.tc.showIgnorableDialog('selections_invalidated', translate('selections_invalidated'));
  }
}