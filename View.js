/**
 * @description:
 *  This class defines the entire view for translationNotes tool
 */
import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import CheckInfoCard from './subcomponents/CheckInfoCard.js'
import style from './css/style'

class View extends React.Component {

  render() {
    //Modules not defined within translationNotes
    const { ScripturePane, VerseCheck, TranslationHelps } = this.props.currentToolViews;
    // set the scripturePane to empty to handle react/redux when it first renders without required data
    let scripturePane = <div></div>
    // populate scripturePane so that when required data is preset that it renders as intended.
    if (this.props.settingsReducer.toolsSettings.ScripturePane !== undefined) {
      scripturePane = <ScripturePane {...this.props} />
    }

    let {contextIdReducer, groupsIndexReducer} = this.props;
    let groupId = contextIdReducer.contextId.groupId;
    let groups = groupsIndexReducer.groupsIndex;
    let match = groups.filter(function (item) {
      return item.id === groupId;
    });
    let groupName = groupId;
    if (match && match[0]) {
      groupName = match[0].name;
    }

    let { translationAcademy } = this.props.resourcesReducer.translationHelps
    let articleId = groupId;
    let currentFile;
    if (translationAcademy && translationAcademy[articleId]) {
      currentFile = this.props.resourcesReducer.translationHelps.translationAcademy[articleId];
    }

    return (
      <div style={{display: 'flex', flex: 'auto'}}>
        <div style={{flex: '2 1 900px', display: "flex", flexDirection: "column"}}>
          {scripturePane}
          <CheckInfoCard phraseTitle={groupName} openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={contextIdReducer.contextId.quote} file={contextIdReducer.contextId.information} />
          <VerseCheck {...this.props} />
        </div>
        <div style={{flex: this.props.showHelps ? '1 1 375px' : '0 0 30px', display: 'flex', justifyContent: 'flex-end', marginLeft: '-15px'}}>
          <div style={style.handleIconDiv}>
            <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                       style={style.handleIcon}
                       onClick={this.props.toggleHelps} />
          </div>
          <div style={{ display: this.props.showHelps ? "flex" : "none", flex: '1' }}>
            <TranslationHelps
              {...this.props}
              currentFile={currentFile}
              online={this.props.settingsReducer.online}
            />
          </div>
        </div>
      </div>
    );
  }
}


module.exports = View;
