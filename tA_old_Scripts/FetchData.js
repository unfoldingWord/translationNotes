/*
 * Events emitted:
 * 	translationAcademyLoaded:
 * 		params:
 * 			sections: an object where keys are section filenames, and values are section text
 * 		listeners:
 * 			TranslationNotesChecker FetchData: waits for translation academy to load so it can use
 * 			the section titles as its group headers
 */

const api = window.ModuleApi;

function fetchData(params, progress, callback) {
	var sectionList = require('./SectionList.json');
	api.putDataInCheckStore('TranslationAcademy', 'sectionList', sectionList.sectionList);
	progress(100);
	callback();
}

module.exports = fetchData;
