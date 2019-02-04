export function getManifest(state) {
  return state.projectDetailsReducer.manifest;
}

export function getProjectSaveLocation(state) {
  return state.projectDetailsReducer.projectSaveLocation;
}

export function getContextId(state) {
  return state.contextIdReducer.contextId;
}

export function getCurrentProjectToolsSelectedGL(state) {
  return state.projectDetailsReducer.currentProjectToolsSelectedGL;
}

export function getGroupsIndex(state) {
  return state.groupsIndexReducer.groupsIndex;
}

export function getResourceByName(state, resourceName) {
  return state.resourcesReducer[resourceName] ? state.resourcesReducer[resourceName] : {};
}

export function getSelections(state) {
  return state.selectionsReducer.selections;
}

export function getCurrentPaneSettings(state) {
  const {ScripturePane} = state.settingsReducer.toolsSettings;
  return ScripturePane ? ScripturePane.currentPaneSettings : [];
}

export function getBibles(state) {
  return state.resourcesReducer.bibles;
}
