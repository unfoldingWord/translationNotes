/**
 * @description:
 *  This class defines the entire view for translationNotes tool
 */
//Api Consts
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;
//Bootstrap consts
const {Row, Col, Tabs, Tab, Glyphicon} = RB;
//Modules not defined within translationNotes
let ScripturePane = null;
let ProposedChanges = null;
let CommentBox = null;
let TranslationHelps = null;
//Components
const DragTargetVerseDisplay = require('./subcomponents/BareTargetVerseDisplay');
const ClickTargetVerseDisplay = require('./subcomponents/TargetVerseDisplay');
const GatewayVerseDisplay = require('./subcomponents/GatewayVerseDisplay.js');
const CheckStatusButtons = require('./subcomponents/CheckStatusButtons');
const ConfirmDisplay = require('./subcomponents/ConfirmDisplay');
const HelpInfo = require('./subcomponents/HelpInfo');
const style = require('./css/style');


class View extends React.Component {
  constructor(){
    super();
    ScripturePane = api.getModule('ScripturePane');
    ProposedChanges = api.getModule('ProposedChanges');
    CommentBox = api.getModule('CommentBox');
    TranslationHelps = api.getModule('TranslationHelps');
  }
  render(){
    let TargetVerseDisplay = null;
    if(this.props.dragToSelect){
      TargetVerseDisplay = <DragTargetVerseDisplay
                                verse={this.props.targetVerse}
                                updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                                style={style.targetVerse}
                                currentCheck={this.props.currentCheck}
                                direction={this.props.direction}
                                bookName={this.props.bookName}
                           />
    }else {
      TargetVerseDisplay = <ClickTargetVerseDisplay
                                verse={this.props.targetVerse}
                                updateSelectedWords={this.props.updateSelectedWords.bind(this)}
                                style={style.targetVerse}
                                currentCheck={this.props.currentCheck}
                                direction={this.props.direction}
                                bookName={this.props.bookName}
                            />
    }
    let toolGlyph = <img src="images/tNIcon.png" style={{height: "25px", marginLeft: "10px"}}/>;
    let proposedChangesGlyph = <Glyphicon glyph="pencil" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    let commentGlyph = <Glyphicon glyph="comment" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    let questionGlyph = <Glyphicon glyph="question-sign" style={{color: "#FFFFFF", fontSize: "20px", marginLeft: "12px"}} />;
    return (
        <Row className="show-grid" style={{margin: '0px', bottom: "0px",  height: "100%"}}>
          <Col sm={12} md={6} lg={9} style={{height: "100%", padding: '0px'}}>
            <ScripturePane currentCheck={this.props.currentCheck} />
            <Col sm={12} md={12} lg={12} style={{height: "100%", padding: '0px', border: "20px solid #0277BD"}}>
              <div style={{padding: '10px', display: "flex", backgroundColor: "#FFFFFF"}}>
                <div style={{padding: '0px', display: "box", width: "500px"}}>
                  <h4>Target Language</h4>
                  {TargetVerseDisplay}
                </div>
                <CheckStatusButtons updateCheckStatus={this.props.updateCheckStatus.bind(this)}
                                    currentCheck={this.props.currentCheck}
                                    goToNext={this.props.goToNext}
                                    goToPrevious={this.props.goToPrevious}
                />
              </div>
                <Tabs
                  activeKey={this.props.tabKey}
                  onSelect={e => this.props.handleSelectTab(e)}
                  id="tabs"
                  style={{backgroundColor: "#FFFFFF", width: "100%"}}>
                  <Tab
                    eventKey={1}
                    title={toolGlyph}
                    style={style.tabStyling}>
                    <div style={{overflowY: 'scroll', padding: "25px", height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                      <div style={style.currentWord}>
                        <h4 style={{color: "#FFFFFF"}}>translationNotes</h4>
                      </div>
                      <ConfirmDisplay phraseInfo={this.props.currentCheck.phraseInfo}
                                      phrase={this.props.currentCheck.phrase}/>
                    </div>
                  </Tab>
                  <Tab eventKey={2} title={proposedChangesGlyph}
                                        style={style.tabStyling}>
                        <div style={{height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                          <ProposedChanges currentCheck={this.props.currentCheck}
                                           updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                                           proposedChangesStore={this.props.proposedChangesStore} />
                        </div>
                  </Tab>
                  <Tab eventKey={3} title={commentGlyph}
                                        style={style.tabStyling}>
                        <div style={{height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                          <CommentBox currentCheck={this.props.currentCheck}
                                      updateCurrentCheck={this.props.updateCurrentCheck.bind(this)}
                                      commentBoxStore={this.props.commentBoxStore} />
                        </div>
                  </Tab>
                  <Tab eventKey={4} title={questionGlyph}
                                            style={style.tabStyling}>
                        <div style={{padding: '10px', height: "calc(100vh - 531px)", backgroundColor: "#333333", boxSizing: "border-box"}}>
                          <HelpInfo />
                        </div>
                  </Tab>
                </Tabs>
            </Col>
          </Col>
          <Col sm={12} md={6} lg={3} style={{height: "100%", padding: "0px"}}>
            <div style={{height: "100vh"}}>
              <Glyphicon glyph={this.props.showHelps ? "chevron-right" : "chevron-left"}
                         style={this.props.showHelps ? style.tHelpsOpen : style.tHelpsClosed}
                         onClick={this.props.toggleHelps} />
              <div style={{display: this.props.showHelps ? "block" : "none", height: "100vh"}}>
                <TranslationHelps currentFile={this.props.currentFile}
                                  online={this.props.online}/>
              </div>
            </div>
          </Col>
        </Row>
    );
  }
}


module.exports = View;
