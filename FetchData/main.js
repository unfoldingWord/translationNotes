import scripturePaneData from './ScripturePane';
import tNFetchData from './TranslationNotes';
let tWordsProgress = 0;
let biblesProgress = 0;

/**
 * @description fetches all data that translationNotes needs.
 * @param {object} props - props coming down from the core.
 * @return {*} returns a promise that handles multiple data fetching.
 */
export default function fetchAllData(props) {
  const projectDetails = props.projectDetailsReducer;
  const bibles = props.resourcesReducer.bibles;
  const actions = props.actions;
  const totalProgress = actions.progress;
  const scripturePaneSettings = props.modulesSettingsReducer.ScripturePane;
  const groupsDataLoaded = props.groupsDataReducer.loadedFromFileSystem;
  const groupsIndexLoaded = props.groupsIndexReducer.loadedFromFileSystem;

  return new Promise(function(resolve, reject) {
    scripturePaneData(projectDetails, bibles, actions, progress, scripturePaneSettings)
    .then(() => {
      tNFetchData(projectDetails, bibles, actions, progress, groupsIndexLoaded, groupsDataLoaded);
    })
    .then(resolve).catch(e => {
      console.warn(e);
    });
  });

  /**
   * @description gets the multiple progress percentages from fethdatas and then puts them together.
   * @param {string} label - fethdata name.
   * @param {number} value - percenatage value.
   */
  function progress(label, value) {
    switch (label) {
      case "translationNotes":
        tWordsProgress = value / 2;
        break;
      case "scripturePane":
        biblesProgress = value / 2;
        break;
      default:
        break;
    }
    totalProgress(tWordsProgress + biblesProgress);
  }
}
