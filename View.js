/**
 * @description:
 *  This class defines the entire view for translationNotes tool
 */
import React from 'react'
import { Row, Col, Tabs, Tab, Glyphicon } from 'react-bootstrap'
import CheckInfoCard from './subcomponents/CheckInfoCard.js'
import style from './css/style'

class View extends React.Component {
  render() {
    //Modules not defined within translationNotes
    const { ScripturePane, VerseCheck, TranslationHelps } = this.props.modules;
    // set the scripturePane to empty to handle react/redux when it first renders without required data
    let {contextIdReducer, groupsIndexReducer} = this.props;
    let scripturePane = <div></div>
    // populate scripturePane so that when required data is preset that it renders as intended.
    if (this.props.modulesSettingsReducer.ScripturePane !== undefined) {
      scripturePane = <ScripturePane {...this.props} />
    }
    let groupId = contextIdReducer.contextId.groupId;
    let groups = groupsIndexReducer.groupsIndex;
    let match = groups.filter(function (item) {
      return item.id === groupId;
    });
    let groupName = groupId;
    if (match && match[0]) {
      groupName = match[0].name;
    }
    return (
      <div style={{display: 'flex', flex: 'auto'}}>
        <div style={{flex: 3, display: "flex", flexDirection: "column"}}>
          {scripturePane}
          <CheckInfoCard phraseTitle={groupName} openHelps={this.props.toggleHelps} showHelps={this.props.showHelps} title={contextIdReducer.contextId.quote} file={contextIdReducer.contextId.information} />
          <VerseCheck
              {...this.props}
          />
        </div>
        <div style={{flex: 1}}>
          <div style={{height: "100vh"}}>
            <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                       style={this.props.showHelps ? style.tHelpsOpen : style.tHelpsClosed}
                       onClick={this.props.toggleHelps} />
            <div style={{ display: this.props.showHelps ? "block" : "none", height: "100vh" }}>
              <TranslationHelps currentFile={this.props.currentFile}
                                online={this.props.statusBarReducer.online} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


module.exports = View;
