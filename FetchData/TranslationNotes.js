const fs = require('fs');
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
    //progress(done / total * 100);
    var book = getULBFromDoor43Static(params.bookAbbr);
    //check to see if gatewayLanguage has already been loaded
    //var gatewayLanguage = api.getDataFromCommon('gatewayLanguage');
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
    parseObject(chapterData, tASectionList, addGroupData, setGroupsIndex);
    progress(100);
    resolve();
  })

  function getULBFromDoor43Static(bookAbr) {
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

  function parseObject(object, tASectionList, addGroupData, setGroupsIndex) {
    var indexList = [];
    var checkObj = {};
    for (let type in object) {
      //parsing the headers/phrases removing uncessesary and messy data
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
      if (!checkObj[type]) checkObj[type] = [];
      for (var check in object[type]['verses']) {
        const currentCheck = object[type]['verses'][check];
        checkObj[type].push({
          contextId: {
            groupId: type,
            occurence: 1,
            quote: currentCheck.phrase,
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
}
