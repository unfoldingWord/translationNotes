import scripturePaneData from './ScripturePane';
import tNFetchData from './TranslationNotes'
const TOTAL_FETCH_DATAS = 2;
var FETCH_DATAS_FINISHED = 0;

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
    .then(()=>{
      FETCH_DATAS_FINISHED++;
      tNFetchData(projectDetails, bibles, actions, progress, groupsIndexLoaded, groupsDataLoaded);
    })
    .then(resolve).catch((e)=>{
      console.warn(e);
    });
  })

  function progress(value) {
    totalProgress(value / (TOTAL_FETCH_DATAS - FETCH_DATAS_FINISHED));
  }
}