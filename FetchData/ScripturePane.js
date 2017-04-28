/**
 * @file The methods to put all the data used by the ScripturePane
 * module into the store. The progress is self contained inside 
 * this file, measures are not 100% true to real speed of load.
 * @author RoyalSix/Manny Colon/Ian Hoegen
 *
 * @exports fetchData
 * @version 1.0.2
 */

import fs from 'fs-extra';
import pathex from 'path-extra';
import path from 'path';
import { toJSON } from 'usfm-parser';
import BooksOfBible from '../utils/BooksOfBible.js';
const NAMESPACE = "ScripturePane";
var missingChunks = 0;

/**
 * @description - This is method initiates the data loading for the scripture pane
 * 
 * @param {object} projectDetails - Contains the project details that a tool may use to load data,
 * such as the params and manifest
 * @param {object} bibles - The bibles stored in the resources for the entire project
 * @param {object} actions - The functions that a tool has access to in order to store data
 * after it is loaded
 * @param {function} progress - Function to send to fetch data container to show progress
 * @param {object} scripturePaneSettings - the current settings.
 * @returns {Promise} - Function that gets called when all the data is finished loading
 */
export default function fetchData(projectDetails, bibles, actions, progress, scripturePaneSettings) {
  return new Promise(function (resolve, reject) {
    const params = projectDetails.params;
    const tcManifest = projectDetails.manifest;
    const { addNewBible, setModuleSettings } = actions;
    const { currentPaneSettings, staticPaneSettings } = getPaneSettings(tcManifest);

    setModuleSettings(NAMESPACE, 'staticPaneSettings', staticPaneSettings);
    if (!scripturePaneSettings) {
      setModuleSettings(NAMESPACE, 'currentPaneSettings', currentPaneSettings);
    } else {
      var oldCurrentPaneSettings = scripturePaneSettings.currentPaneSettings;
      var newCurrentPaneSettings = [];

      oldCurrentPaneSettings.forEach(function (setting) {
        var match = staticPaneSettings.filter(function (item) {
          return item.sourceName === setting.sourceName;
        });
        if (match) {
          newCurrentPaneSettings.push(match[0]);
        }
      });
      setModuleSettings(NAMESPACE, 'currentPaneSettings', newCurrentPaneSettings);
    }
    getTargetLanguage().then(() => {
      progress("scripturePane", 17);
      getOriginalLanguage();
    }).then(() => {
      progress("scripturePane", 66);
      getUDB();
    }).then(() => {
      progress("scripturePane", 100);
      resolve();
    }).catch(reject);

    /**
     * @description - Gets the target language based on the finished finished_frames
     * specified in the manifest, and stores it in the resourcesReducer
     * 
     * @returns {Promise} - Resource has been read in
     */
    function getTargetLanguage() {
      return new Promise((resolve, reject) => {
        try {
          readInManifest(tcManifest, params.targetLanguagePath, addNewBible, resolve);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * @description - Gets the original language based on the path specified in the params
     * and stores it in the resourcesReducer
     * 
     * @returns {Promise} - Resource has been read in
     */
    function getOriginalLanguage() {
      return new Promise((resolve, reject) => {
        try {
          var originalPath = path.join(params.originalLanguagePath, bookAbbreviationToBookPath(params.bookAbbr))
          readInOriginal(originalPath, params, addNewBible, resolve);
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * @description - Gets the UDB based on a static resource located in the tC directory 
     * and stores it in the resourcesReducer
     * 
     * @returns {Promise} - Resource has been read in
     */
    function getUDB() {
      return new Promise((resolve, reject) => {
        try {
          var gatewayLanguageUDBPath = path.join(window.__base, 'static', 'taggedUDB');
          parseUSFM(gatewayLanguageUDBPath, params.bookAbbr, addNewBible, resolve)
        } catch (e) {
          reject(e);
        }
      });
    }

    /**
     * @description - Checks if the book is an old testament one or not
     * 
     * @param {string} projectBook - the abbreviation of the book to check
     */
    function isOldTestament(projectBook) {
      var passedBook = false;
      for (var book in BooksOfBible) {
        if (book == projectBook) passedBook = true;
        if (BooksOfBible[book] == "Malachi" && passedBook) {
          return true;
        }
      }
      return false;
    }

    /**
     * @description - This method parse the USFM for the gateway language which is loaded form the 
     * location specified in the params
     * 
     * @param {string} savePath - Path of the project folder
     * @param {string} bookAbbr - Book abbreviation of the current project book
     * @param {function} addNewBible - Tool action to store a Bible in the resources
     * @param {function} callback - Callback when data is finished being loaded
     */
    function parseUSFM(savePath, bookAbbr, addNewBible, callback) {
      var projectFolder = fs.readdirSync(savePath);
      var targetLanguage;
      for (var file in projectFolder) {
        var parsedPath = path.parse(projectFolder[file]);
        if ((parsedPath.ext.toUpperCase() == ".SFM" || parsedPath.ext.toUpperCase() == '.USFM') && parsedPath.name.includes(bookAbbr.toUpperCase())) {
          var actualFile = path.join(savePath, parsedPath.base);
          try {
            var data = fs.readFileSync(actualFile);
          } catch (err) {
            console.warn("There was an error getting the UDB")
          }
          var usfmData = data.toString();
          var parsedUSFM = toJSON(usfmData);
          if (parsedUSFM.headers['id']) parsedUSFM.book = parsedUSFM.headers['id'].split(" ")[0].toLowerCase();
          saveUDBinAPI(parsedUSFM, addNewBible);
        }
      }
      callback();
    }


    /**
     * @description - This method saves the parsed USFM according to tC standards
     * 
     * @param {object} parsedUSFM - Parsed gatewayLanguage USFM
     * @param {function} addNewBible - Tool action to store a Bible in the resources
     */
    function saveUDBinAPI(parsedUSFM, addNewBible) {
      var targetLanguage = {};
      targetLanguage.title = parsedUSFM.book;
      var chapters = parsedUSFM.chapters;
      for (var ch in chapters) {
        targetLanguage[chapters[ch].number] = {};
        var verses = chapters[ch].verses;
        for (var v in verses) {
          var verseText = verses[v].text.trim();
          targetLanguage[chapters[ch].number][verses[v].number] = verseText;
        }
      }
      if (parsedUSFM.headers) {
        var parsedHeaders = parsedUSFM.headers;
        if (parsedHeaders['mt1']) {
          targetLanguage.title = parsedHeaders['mt1'];
        } else if (parsedHeaders['id']) {
          targetLanguage.title = books[parsedHeaders['id'].toLowerCase()];
        }
      }
      addNewBible('UDB', targetLanguage);
    }


    /**
     * @description - A method to convert a book abbreviation to a
     * path for reading in a book from the file system.
     * 
     * @param {string} bookAbbr 
     * @returns {string}
     */
    function bookAbbreviationToBookPath(bookAbbr) {
      var bookName = convertToFullBookName(bookAbbr);
      bookName = bookName.replace(/\s/g, '') + '.json';
      return bookName;
    }

    /**
     * @description This function takes the manifest file and parses it to JSON.
     * @param {string} manifest - The manifest.json file
     */
    function readInManifest(manifest, source, addNewBible, callback) {
      var bookTitle;
      if (manifest.ts_project) {
        bookTitle = manifest.ts_project.name;
      } else {
        bookTitle = manifest.project.name;
      }
      let bookTitleSplit = bookTitle.split(' ');
      var bookName = bookTitleSplit.join('');
      let bookFileName = bookName + '.json';
      let finishedChunks = manifest.finished_chunks || manifest.finished_frames;
      var total = len(finishedChunks);
      if (total == 0) callback();
      let currentJoined = {};
      var done = 0;
      for (let chapterVerse in finishedChunks) {
        if (finishedChunks.hasOwnProperty(chapterVerse)) {
          let splitted = finishedChunks[chapterVerse].split('-');
          openUsfmFromChunks(splitted, currentJoined, total, source, function () {
            done++;
            if (done >= total - missingChunks) {
              missingChunks = 0;
              addNewBible('targetLanguage', currentJoined);
              callback();
            }
          });
        }
      }
    }

    /**
     * @description - Method to read in the original language from a path specified
     *  in the params.
     * 
     * @param {string} originalLanguagePath - The path to load originalLanguage from
     * @param {object} params - Project specific parameters (metadata)
     * @param {function} addNewBible - Tool action to store a Bible in the resources
     * @param {function} callback - Callback invoked when data is finished being loaded
     */
    function readInOriginal(originalLanguagePath, params, addNewBible, callback) {
      var bookAbbr = params.bookAbbr;
      var originalLanguage = params.originalLanguage;
      try {
        var data = fs.readFileSync(originalLanguagePath).toString();
        if (!data) { } else {
          var betterData = typeof data == 'object' ? JSON.stringify(data) : data;
          var origText = openOriginal(betterData, convertToFullBookName(bookAbbr));
          if (originalLanguage == "hebrew") {
            parseHebrew(addNewBible, origText);
          } else {
            parseGreek(addNewBible, origText);
          }
          callback();
        }
      } catch (error) {
        console.log(error);
      }
    }

    /**
    * @description This function opens the chunks defined in the manifest file.
    * @param {array} chunk - An array of the chunks defined in manifest
    ******************************************************************************/
    function openUsfmFromChunks(chunk, currentJoined, totalChunk, source, callback) {
      let currentChapter = chunk[0];
      try {
        currentChapter = parseInt(currentChapter);
        var fileName = chunk[1] + '.txt';
        var chunkLocation = path.join(source, chunk[0], fileName);
        var data = fs.readFileSync(chunkLocation);
        if (!data) { }
        joinChunks(data.toString(), currentChapter, currentJoined);
        callback();
      } catch (error) {
        missingChunks++;
      }
    }

/**
 * @description This function saves the chunks locally as a window object;
 * @param {string} text - The text being read in from chunks
 ******************************************************************************/
function joinChunks(text, currentChapter, currentJoined) {
  if (currentChapter === 0) {
    currentJoined.title = text;
  } else {
    if (currentJoined[currentChapter] === undefined) {
      currentJoined[currentChapter] = {};
    }
    var currentChunk = parseTargetLanguage(text);
    for (let verse in currentChunk.verses) {
      if (currentChunk.verses.hasOwnProperty(verse)) {
        var currentVerse = currentChunk.verses[verse];
        currentJoined[currentChapter][parseInt(verse)] = currentVerse;
      }
    }
  }
}

function parseTargetLanguage(usfm) {
  let chapData = {};
  let chapters = usfm.split("\\c ");
  for (let ch in chapters) {
    if (chapters[ch] === "") continue;
    if (/\\h /.exec(chapters[ch])) {
      chapData.header = chapters[ch];
    } else {
      let chapNum = "verses";
      chapData[chapNum] = {};
      let verses = chapters[ch].split("\\v ");
      for (let v in verses) {
        if (verses[v] === "") continue;
        let verseNum;
        try { // this shoudl work the majority of the time
          [, verseNum] = /^(\d+)/.exec(verses[v]);
        } catch (e) {
          verseNum = "-1";
        }
        chapData[chapNum][verseNum] = verses[v].replace(/^\s*(\d+)\s*/, "");
      }
    }
  }
  return chapData;
}

    /**
     * @description - Method to parse a JSON string and format by chapter and verse
     * 
     * @param {string} text - JSON string of original language to be parsed
     * @param {string} bookName - The book abbreviation of the current project book
     * @returns {object}
     */
    function openOriginal(text, bookName) {
      var input = JSON.parse(text);
      input[bookName].title = bookName;
      var newData = {};
      for (var chapter in input[bookName]) {
        newData[parseInt(chapter)] = {};
        for (var verse in input[bookName][chapter]) {
          newData[parseInt(chapter)][parseInt(verse)] = input[bookName][chapter][verse];
        }
      }
      return input[bookName];
    }

    /**
     * @description - Returns the length of key fields in an object
     * 
     * @param {object} obj - The object to be evaluated
     */
    function len(obj) {
      var length = 0;
      for (let item in obj) {
        length++;
      }
      return length;
    }


    /**
     * @description - This method stores the original language with the matching lexicon
     * and strong number so that the scripture pane is able to access it.
     * 
     * @param {function} addNewBible - Tool action to store a Bible in the resources
     * @param {object} origText - Parsed original language by chapter / verse
     */
    function parseGreek(addNewBible, origText) {
      var lex = require("../static/Lexicon.json");
      let parsedText = {};
      for (let ch in origText) {
        if (!parseInt(ch)) {
          // skip the title
          continue;
        }
        parsedText[ch] = {};
        let chap = origText[ch];
        for (let v in chap) {
          let origVerseFull = origText[ch][v];
          let origVerse = origVerseFull.split(" ");
          let verse = parsedText[ch][v] = [];
          var word;
          var strong = "Strong Missing";
          var brief = "Brief Missing";
          var long = "Long Missing";
          for (var element in origVerse) {
            try {
              var currentElement = origVerse[element];
              var nextElement = origVerse[parseInt(element) + 1];
              if (isNaN(currentElement[currentElement.length - 1]) && !isNaN(nextElement[nextElement.length - 1])) {
                word = currentElement;
                strong = nextElement;
                brief = lex[strong].brief;
                long = lex[strong].long;
                verse.push({ word, strong, brief, long });
              }
            } catch (e) {
              if (word) {
                //verse.push({ word, strong, brief });
              }
            }
          }
        }
      }
      addNewBible('originalLanguage', parsedText);
    }

    /**
     * @description - This method stores the original language with the matching lexicon
     * and strong number so that the scripture pane is able to access it.
     * 
     * @param {function} addNewBible - Tool action to store a Bible in the resources
     * @param {object} origText - Parsed original language by chapter / verse
     */
    function parseHebrew(addNewBible, origText) {
      var lex = require("../static/HebrewLexicon.json");
      let parsedText = {};
      for (let ch in origText) {
        if (!parseInt(ch)) {
          // skip the title
          continue;
        }
        parsedText[ch] = {};
        let chap = origText[ch];
        for (let v in chap) {
          let origVerseFull = origText[ch][v];
          let origVerse = origVerseFull.split(" ");
          let verse = parsedText[ch][v] = [];
          var word;
          var strong = "Strong Missing";
          var brief = "Brief Missing";
          for (var element in origVerse) {
            try {
              var currentElement = origVerse[element];
              var nextElement = origVerse[parseInt(element) + 1];
              if (isNaN(currentElement[currentElement.length - 1]) && !isNaN(nextElement[nextElement.length - 1])) {
                word = currentElement;
                strong = nextElement;
                brief = lex[strong].strongs_def;
                verse.push({ word, strong, brief });
              }
            } catch (e) {
              if (word) {
                //verse.push({ word, strong, brief });
              }
            }
          }
        }
      }
      addNewBible('originalLanguage', parsedText);
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

    /**
     * @description - Method to initalize the data to be displayed in the ScripturePane
     * 
     * @param {object} tcManifest - Project manifest
     */
    function getPaneSettings(tcManifest) {
      let targetLanguageName = "";
      let gatewayLanguageName = "";
      let gatewayLanguageVersion = "";
      let originalLanguageName = "";
      let bookAbbr = "";
      if (tcManifest && tcManifest.target_language) {
        targetLanguageName = tcManifest.target_language.name;
      }
      if (tcManifest && (tcManifest.source_translations.length !== 0)) {
        gatewayLanguageName = tcManifest.source_translations[0].language_id.toUpperCase();
        gatewayLanguageVersion = " (" + tcManifest.source_translations[0].resource_id.toUpperCase() + ")";
      }
      let gatewayLanguageHeading = {
        heading: gatewayLanguageName + " " + gatewayLanguageVersion,
        headingDescription: "Gateway Language"
      }
      let targetLanguageHeading = {
        heading: targetLanguageName,
        headingDescription: "Target Language"
      }
      let UDBHeading = {
        heading: gatewayLanguageName + " (UDB)",
        headingDescription: "Gateway Language"
      }
      if (tcManifest.ts_project) {
        bookAbbr = tcManifest.ts_project.id;
      }
      else if (tcManifest.project) {
        bookAbbr = tcManifest.project.id;
      }
      else {
        bookAbbr = tcManifest.project_id;
      }

      if (isOldTestament(bookAbbr)) {
        originalLanguageName = "Hebrew";
      } else {
        originalLanguageName = "Greek (UGNT)";
      }

      let originalLanguageHeading = {
        heading: originalLanguageName,
        headingDescription: "Original Language"
      }
      let staticPaneSettings = [
        {
          sourceName: "originalLanguage",
          dir: "ltr",
          heading: originalLanguageHeading
        },
        {
          sourceName: "gatewayLanguage",
          dir: "ltr",
          heading: gatewayLanguageHeading
        },
        {
          sourceName: "targetLanguage",
          dir: null,
          heading: targetLanguageHeading
        },
        {
          sourceName: "UDB",
          dir: 'ltr',
          heading: UDBHeading
        }
      ];
      let currentPaneSettings = [
        {
          sourceName: "gatewayLanguage",
          dir: "ltr",
          heading: gatewayLanguageHeading
        }
      ];

      return { staticPaneSettings, currentPaneSettings }
    }

  })
}
