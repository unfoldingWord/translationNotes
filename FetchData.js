
const api = window.ModuleApi;
const fs = require('fs');

const HTMLScraper = require('./parsers/HTMLscraper');
const Parser = require('./parsers/tNParser.js');
const Door43DataFetcher = require('./parsers/Door43DataFetcher.js');

const DataFetcher = function (params, progress, onComplete) {
  /**
  * @description This fetches the data for translationHelps (TranslationAcademy
  * specifically)
  *******************************************************************************/
  var sectionList = require('./static/SectionList.json');
  var tASectionList = sectionList.sectionList;
  api.putDataInCheckStore('TranslationHelps', 'sectionList', tASectionList);

  var phraseData;
  params = params;
  var DoorDataFetcher = new Door43DataFetcher();
  var chapterData = {};
  onCompleteFunction = onComplete;
    //progress(done / total * 100);
    var book = getULBFromDoor43Static(params.bookAbbr);
      //check to see if gatewayLanguage has already been loaded
      var gatewayLanguage = api.getDataFromCommon('gatewayLanguage');
      if (!gatewayLanguage) {
        ulb = DoorDataFetcher.getULBFromBook(book);
        var newStructure = { title: '' };
        for (chapter in ulb) {
          for (verses in ulb[chapter]) {
            var chapterNumber = ulb[chapter][verses].num;
            newStructure[chapterNumber] = {};
            for (verse in ulb[chapter][verses].verses) {
              var verseNumber = ulb[chapter][verses].verses[verse].num;
              var verse = ulb[chapter][verses].verses[verse].text;
              newStructure[chapterNumber][verseNumber] = verse;
            }
          }
        }
        //assign gatewayLanguage into CheckStore
        newStructure.title = api.convertToFullBookName(params.bookAbbr);
        api.putDataInCommon('gatewayLanguage', newStructure);
      }
  chapterData = DoorDataFetcher.getTNFromBook(book, params.bookAbbr);
  phraseData = parseObject(chapterData, tASectionList);
  saveData(phraseData, params, onComplete);
};

function getULBFromDoor43Static(bookAbr) {
  var ULB = {};
  ULB['chapters'] = [];
  const pathBase = __dirname + '/static/Door43/notes/';
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

var parseObject = function (object, tASectionList) {
  let phraseObject = {};
  phraseObject["groups"] = [];
  for (let type in object) {
    var newGroup = { group: type, checks: [] };
    //parsing the headers/phrases removing uncessesary and messy data
    let typeMD = type + ".md";
      for(var sectionFileName in tASectionList) {
        if(sectionFileName === typeMD){
          var titleKeyAndValue = tASectionList[sectionFileName]['file'].match(/title: .*/)[0];
          var title = titleKeyAndValue.substr(titleKeyAndValue.indexOf(':') + 1);
        }
      }
    for (let verse of object[type].verses) {
      let newVerse = Object.assign({}, verse);
      newVerse.checkStatus = "UNCHECKED";
      newVerse.spelling = false;
      newVerse.wordChoice = false;
      newVerse.punctuation = false;
      newVerse.meaning = false;
      newVerse.grammar = false;
      newVerse.other = false;
      newVerse.proposedChanges = "";
      newVerse.comment = "";
      newVerse.groupName = title;
      newGroup.checks.push(newVerse);
    }
    phraseObject["groups"].push(newGroup);
  }
  return phraseObject;
};

// Saves phrase data into the CheckStore
function saveData(phraseObject, params, onCompleteFunction) {
  api.putDataInCheckStore('TranslationNotesChecker', 'book', api.convertToFullBookName(params.bookAbbr));
  //TODO: This shouldn't be put in check store because we don't want it to be saved
  var groups = phraseObject['groups'];
  var gatewayLanguage = api.getDataFromCommon('gatewayLanguage');
  for (var group in groups) {
    for (var item in groups[group].checks) {
      var checkObject = groups[group].checks[item];
      var gatewayAtVerse = gatewayLanguage[checkObject.chapter][checkObject.verse];
      groups[group].checks[item].gatewayLanguage = gatewayAtVerse;
    }
  }
  api.putDataInCheckStore('TranslationNotesChecker', 'groups', groups);
  api.putDataInCheckStore('TranslationNotesChecker', 'currentCheckIndex', 0);
  api.putDataInCheckStore('TranslationNotesChecker', 'currentGroupIndex', 0);
  onCompleteFunction(null);
}

module.exports = DataFetcher;
