
export const loadCorrectPaneSettings = (props, setToolSettings, bibles) => {
  const { tc: {selectedToolName}} = props;
  const { currentProjectToolsSelectedGL } = props.projectDetailsReducer;
  const languageId = currentProjectToolsSelectedGL[selectedToolName];
  const { ScripturePane } = props.settingsReducer.toolsSettings;
  let currentPaneSettings = ScripturePane ? ScripturePane.currentPaneSettings : null;
  const paneSeetingsIncludeGLandUlbOrUlt = (paneSetting) => {
    return paneSetting.languageId === languageId && (paneSetting.bibleId === 'ulb' || paneSetting.bibleId === 'ult');
  };

  // make sure bibles in currentPaneSettings are found in the bibles object in the resourcesReducer
  currentPaneSettings = currentPaneSettings ? currentPaneSettings.filter((paneSetting) => {
    return bibles[paneSetting.languageId] && bibles[paneSetting.languageId][paneSetting.bibleId] ? true : false;
  }) : currentPaneSettings;

  // making sure the right ult or ulb language is displayed in the scripture pane
  if (currentPaneSettings && !currentPaneSettings.some(paneSeetingsIncludeGLandUlbOrUlt) && currentPaneSettings.length > 0) {
    const newCurrentPaneSettings = currentPaneSettings.map((paneSetting) => {
      const isUlbOrUlt = paneSetting.bibleId === 'ult' || paneSetting.bibleId === 'ulb';
      if (isUlbOrUlt && languageId === 'en') {
        paneSetting.languageId = languageId;
        paneSetting.bibleId = 'ult';
      } else if (isUlbOrUlt && languageId === 'hi') {
        paneSetting.languageId = languageId;
        paneSetting.bibleId = 'ulb';
      }
      return paneSetting;
    });
    setToolSettings("ScripturePane", "currentPaneSettings", newCurrentPaneSettings);
  }
  if (!ScripturePane || currentPaneSettings.length === 0) {
    // initializing the ScripturePane settings if not found.
    let bibleId;
    if (languageId === 'en') {
      bibleId = 'ult';
    } else { // for hindi is ulb
      bibleId = 'ulb';
    }
    const initialCurrentPaneSettings = [
      {
        languageId,
        bibleId
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    setToolSettings("ScripturePane", "currentPaneSettings", initialCurrentPaneSettings);
  }
};
