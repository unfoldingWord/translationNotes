import fs from 'fs-extra';
import path from 'path-extra';
import isEqual from 'deep-equal';
const CHECKDATA_DIRECTORY = path.join('.apps', 'translationCore', 'checkData');

/**
 * returns true if contextIds are a match for reference and group
 * @param {Object} contextId1
 * @param {Object} contextId2
 * @return {boolean}
 */
export function sameContext(contextId1, contextId2) {
  if (!!contextId1 && !!contextId2) {
    return isEqual(contextId1.reference, contextId2.reference) &&
      (contextId1.groupId === contextId2.groupId);
  }
  return false;
}



/**
 * @description This helper method generates a timestamp in milliseconds for use
 *              in the storing of data in the app. Timestamps will be used to
 *              generate filenames and modified dates.
 * @param {String} str A date string. If null, will be current date
 * @return {String} The timestamp in milliseconds
 ******************************************************************************/
export function generateTimestamp(str) {
  if (!str) {
    return (new Date()).toJSON();
  } else {
    return (new Date(str)).toJSON();
  }
}

export function getSelectionsFromChapterAndVerseCombo(bookId, chapter, verse, projectSaveLocation, quote = "") {
  let selectionsObject = {};
  const contextId = {
    reference: {
      bookId,
      chapter,
      verse
    }
  };
  const selectionsPath = generateLoadPath(projectSaveLocation, contextId, 'selections');

  if (fs.existsSync(selectionsPath)) {
    let files = fs.readdirSync(selectionsPath);
    files = files.filter(file => { // filter the filenames to only use .json
      return path.extname(file) === '.json';
    });
    let sorted = files.sort().reverse(); // sort the files to use latest
    if (quote) {
      sorted = sorted.filter((filename) => {
        const currentSelectionsObject = fs.readJsonSync(path.join(selectionsPath, filename));
        return currentSelectionsObject.contextId.quote === quote;
      });
    }
    const filename = sorted[0];
    selectionsObject = fs.readJsonSync(path.join(selectionsPath, filename));
  }
  return selectionsObject;
}

/**
 * Generates the output directory.
 * @param {Object} state - store state object.
 * @param {String} checkDataName - checkDate folder name where data will be saved.
 *  @example 'comments', 'reminders', 'selections', 'verseEdits' etc.
 * @return {String} save path
 */
export function generateLoadPath(projectSaveLocation, contextId, checkDataName) {
  /**
  * @description output directory
  *  /translationCore/ar_eph_text_ulb/.apps/translationCore/checkData/comments/eph/1/3
  * @example PROJECT_SAVE_LOCATION - /translationCore/ar_eph_text_ulb
  * @example CHECKDATA_DIRECTORY - /.apps/translationCore/checkData
  * @example bookAbbreviation - /eph
  * @example checkDataName - /comments
  * @example chapter - /1
  * @example verse - /3
  */
  const PROJECT_SAVE_LOCATION = projectSaveLocation;
  if (PROJECT_SAVE_LOCATION) {
    let bookAbbreviation = contextId.reference.bookId;
    let chapter = contextId.reference.chapter.toString();
    let verse = contextId.reference.verse.toString();
    let loadPath = path.join(
      PROJECT_SAVE_LOCATION,
      CHECKDATA_DIRECTORY,
      checkDataName,
      bookAbbreviation,
      chapter,
      verse
    );
    return loadPath;
  }
}