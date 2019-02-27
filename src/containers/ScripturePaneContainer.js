import React from 'react';
import PropTypes from 'prop-types';
import {ScripturePane} from 'tc-ui-toolkit';

class ScripturePaneContainer extends React.Component {
  makeTitle(manifest) {
    const {target_language, project} = manifest;
    if (target_language && target_language.book && target_language.book.name) {
      return target_language.book.name;
    } else {
      return project.name;
    }
  }

  render() {
    const {
      manifest,
      showPopover,
      editTargetVerse,
      projectDetailsReducer,
      getLexiconData,
      selections,
      setToolSettings,
      bibles,
      contextId,
      translate,
      currentPaneSettings,
      getAvailableScripturePaneSelections,
      makeSureBiblesLoadedForTool
    } = this.props;

    const expandedScripturePaneTitle = this.makeTitle(manifest);
    return (
      <ScripturePane
        currentPaneSettings={currentPaneSettings}
        contextId={contextId}
        bibles={bibles}
        expandedScripturePaneTitle={expandedScripturePaneTitle}
        showPopover={showPopover}
        editTargetVerse={editTargetVerse}
        projectDetailsReducer={projectDetailsReducer}
        translate={translate}
        getLexiconData={getLexiconData}
        selections={selections}
        setToolSettings={setToolSettings}
        getAvailableScripturePaneSelections={getAvailableScripturePaneSelections}
        makeSureBiblesLoadedForTool={makeSureBiblesLoadedForTool}
      />
    );
  }
}

ScripturePaneContainer.propTypes = {
  bibles: PropTypes.object,
  contextId: PropTypes.object,
  translate: PropTypes.func,
  currentToolName: PropTypes.string,
  manifest: PropTypes.object,
  commentsReducer: PropTypes.object,
  projectDetailsReducer: PropTypes.object,
  selections: PropTypes.array,
  currentPaneSettings: PropTypes.array,
  groupsDataReducer: PropTypes.object,
  loginReducer: PropTypes.object,
  contextIdReducer: PropTypes.shape({
    contextId: PropTypes.object.isRequired
  }),
  toolsReducer: PropTypes.object,
  actions: PropTypes.shape({
    changeSelections: PropTypes.func.isRequired,
    goToNext: PropTypes.func.isRequired,
    goToPrevious: PropTypes.func.isRequired,
  }),
  showPopover: PropTypes.func.isRequired,
  editTargetVerse: PropTypes.func.isRequired,
  makeSureBiblesLoadedForTool: PropTypes.func.isRequired,
  getAvailableScripturePaneSelections: PropTypes.func.isRequired,
  getLexiconData: PropTypes.func.isRequired,
  setToolSettings: PropTypes.func.isRequired,
};

export default ScripturePaneContainer;
