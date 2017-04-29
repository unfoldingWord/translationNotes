const fs = require('fs');
const path = require('path');
const HTMLScraper = require('../parsers/HTMLscraper');
const Parser = require('../parsers/tNParser.js');
const Door43DataFetcher = require('../parsers/Door43DataFetcher.js');
/**
* Fetch data.
* @param {Object} params - .
* @param {function} progress -
* @param {function} callback -
* @param {function} addNewBible (callback) - callback that uses a redux action to save a bible to
*        the resources reducer.
*        @example take in two arguments bible name/version and bible data
* @param {function} addNewResource (callback) - callback that uses a redux action to save a resource to
*        the resources reducer.
*        @example take in two arguments resource name and resource data
*/
export default function fetchData(projectDetails, bibles, actions, progress, groupsIndexLoaded, groupsDataLoaded) {
  return new Promise(function (resolve, reject) {
    const params = projectDetails.params;
    const { addNewBible, setModuleSettings, addGroupData, setGroupsIndex, setProjectDetail } = actions;
    setProjectDetail('bookName', convertToFullBookName(params.bookAbbr));
    /**
    * @description This fetches the data for translationHelps (TranslationAcademy
    * specifically)
    */
    var sectionList = require('../static/SectionList.json');
    var tASectionList = sectionList.sectionList;
    //api.putDataInCheckStore('TranslationHelps', 'sectionList', tASectionList);
    var ulb;
    var phraseData;
    var DoorDataFetcher = new Door43DataFetcher();
    var chapterData = {};
    //
    var book = getULBFromDoor43Static(params.bookAbbr, progress);
    ulb = DoorDataFetcher.getULBFromBook(book);
    var newStructure = { title: '' };
    for (let chapter in ulb) {
      for (let verses in ulb[chapter]) {
        var chapterNumber = ulb[chapter][verses].num;
        newStructure[chapterNumber] = {};
        for (let verse in ulb[chapter][verses].verses) {
          var verseNumber = ulb[chapter][verses].verses[verse].num;
          var verse = ulb[chapter][verses].verses[verse].text;
          newStructure[chapterNumber][verseNumber] = verse.replace(/\n.*/, '');
        }
      }
    }
    //assign gatewayLanguage into CheckStore
    newStructure.title = api.convertToFullBookName(params.bookAbbr);
    //this is used to replace api.putDataInCommon
    addNewBible('ULB', newStructure);
    addNewBible('gatewayLanguage', newStructure);
    chapterData = DoorDataFetcher.getTNFromBook(book, newStructure, params.bookAbbr, () => { });
    let filters = readFilters(convertToFullBookName(params.bookAbbr));
    parseObject(chapterData, tASectionList, addGroupData, setGroupsIndex, filters);
    resolve();
  })

  function getULBFromDoor43Static(bookAbr, progress) {
    var ULB = {};
    ULB['chapters'] = [];
    const pathBase = __dirname + '/../static/Door43/notes/';
    var bookFolder = fs.readdirSync(pathBase + bookAbr);
    for (var chapter in bookFolder) {
      var currentChapter = [];
      if (isNaN(bookFolder[chapter])) continue;
      var chapterFolder = fs.readdirSync(pathBase + bookAbr + '/' + bookFolder[chapter]);
      var currentChapterPath = pathBase + bookAbr + '/' + bookFolder[chapter];
      currentChapter['num'] = bookFolder[chapter];
      currentChapter['verses'] = [];
      for (var verse in chapterFolder) {
        if (isNaN(chapterFolder[verse][0])) continue;
        var currentVerse = {};
        try {
          var data = fs.readFileSync(currentChapterPath + "/" + chapterFolder[verse]);
          currentVerse['file'] = data.toString();
          currentVerse['num'] = chapterFolder[verse].split('.')[0];
          currentChapter['verses'].push(currentVerse);
        } catch (e) {
          console.error(e);
        }
      }
      if (currentChapter['verses'].length > 0) ULB['chapters'].push(currentChapter);
    }
    return ULB;
  }

  function parseObject(object, tASectionList, addGroupData, setGroupsIndex, filters) {
    var indexList = [];
    var checkObj = {};
    for (let type in object) {
      let done = Object.keys(object).indexOf(type);
      let progressPercentage = done / (Object.keys(object).length - 1) * 100;
      progress("translationNotes", progressPercentage);
      // parsing the headers/phrases removing uncessesary and messy data
      let typeMD = type + ".md";
      for (var sectionFileName in tASectionList) {
        if (sectionFileName === typeMD) {
          var titleKeyAndValue;
          var groupName;
          try {
            titleKeyAndValue = tASectionList[sectionFileName]['file'].match(/title: .*/)[0];
            groupName = titleKeyAndValue.substr(titleKeyAndValue.indexOf(':') + 1);
          } catch (e) {
            groupName = tASectionList[sectionFileName]['file'].match(/===== (.*) =====/)[1];
          }
          indexList.push({ id: type, name: groupName });
        }
      }
      for (var check in object[type]['verses']) {
        const currentCheck = object[type]['verses'][check];
        let found = false;
        if (filters) {
          let currentFilter = filters.primary[currentCheck.chapter + ":" + currentCheck.verse];
          if (!currentFilter || !currentFilter.includes(currentCheck.phrase)) {
            continue;
          }
        }
        if (!checkObj[type]) checkObj[type] = [];
        checkObj[type].push({
          contextId: {
            groupId: type,
            occurrence: 1,
            quote: currentCheck.phrase,
            information: currentCheck.phraseInfo,
            reference: {
              bookId: currentCheck.book,
              chapter: currentCheck.chapter,
              verse: currentCheck.verse
            },
            tool: 'TranslationNotesChecker'
          },
          information: currentCheck.phraseInfo,
          priority: 1
        });
      }
    }
    Object.keys(checkObj).map(function (key, index) {
      addGroupData(key, checkObj[key]);
    });
    setGroupsIndex(indexList);
  }

  /**
  * @description - Method to convert a book abbreviation to the full name
  *
  * @param {string} bookAbbr
  */
  function convertToFullBookName(bookAbbr) {
    if (!bookAbbr) return;
    return BooksOfBible[bookAbbr.toString().toLowerCase()];
  }
}

function readFilters(bookName) {
  try {
    let file = fs.readFileSync(path.join(__dirname, '../filters/', bookName + '.csv')).toString();
    let lines = file.split('\n');
    let primaryMatrix = [];
    let secondaryMatrix = [];
    for (let i = 1; i < lines.length; i++) {
      let line = lines[i].split(',');
      let value = parseFloat(line[5]);
      let chapterVerse = line[1] + ':' + line[2];
      if (value >= 1.5) {
        if (!primaryMatrix[chapterVerse]) {
          primaryMatrix[chapterVerse] = [];
        }
        primaryMatrix[chapterVerse].push(line[4]);
      } else {
        if (!secondaryMatrix[chapterVerse]) {
          secondaryMatrix[chapterVerse] = [];
        }
        secondaryMatrix[chapterVerse].push(line[4]);
      }
    }
    return {
      primary: primaryMatrix,
      secondary: secondaryMatrix
    };
  } catch (err) {
    return null;
  }
}
