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
const style = require('./css/Style');


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
                                updateSelectedWords={this.props.updateSelectedWords.bind(this)}
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
    let proposedChangesGlyph = <Glyphicon glyph="pencil" style={{color: "#FFFFFF"}} />;
    let commentGlyph = <Glyphicon glyph="comment" style={{color: "#FFFFFF"}} />;
    return (
      <div>
        <ScripturePane currentCheck={this.props.currentCheck} />
        <Row className="show-grid" style={{ marginTop: '0px' }}>
          <div style={style.currentWordDiv}>
            {this.props.currentCheck.groupName}
          </div>
          <Col sm={12} md={6} lg={4} style={{padding: '0px'}}>
            <div style={{padding: '0px', height: "348px"}}>
              {TargetVerseDisplay}
            </div>
            <div style={{padding: '0px'}}>
              <CheckStatusButtons updateCheckStatus={this.props.updateCheckStatus.bind(this)}
                                  currentCheck={this.props.currentCheck}/>
            </div>
          </Col>
          <Col sm={12} md={6} lg={4} style={{padding: '0px', display: "flex"}}>
              <Tabs activeKey={this.props.tabKey}
                    onSelect={e => this.props.handleSelectTab(e)}
                    id="controlled-tab-example"
                    bsStyle='pills'
                    style={{backgroundColor: "#747474"}}>
                  <Tab eventKey={1} title={proposedChangesGlyph}
                       style={style.tabStyling}>
                    <ProposedChanges currentCheck={this.props.currentCheck}
                                     proposedChangesStore={this.props.proposedChangesStore} />
                  </Tab>
                  <Tab eventKey={2} title={commentGlyph}
                       style={style.tabStyling}>
                     <CommentBox currentCheck={this.props.currentCheck}
                                 commentBoxStore={this.props.commentBoxStore} />
                  </Tab>
              </Tabs>
              <div style={style.buttonsDivPanel}>
                <button onClick={this.props.goToPrevious}
                        title="Click to go to the previous check"
                        style={style.goToPreviousButton}>
                  <Glyphicon glyph="chevron-up" style={style.buttonGlyphicons} />
                </button>
                <button onClick={this.props.goToNext}
                        title="Click to go to the next check"
                        style={style.goToNextButton}>
                  <Glyphicon glyph="chevron-down" style={style.buttonGlyphicons} />
                </button>
              </div>
          </Col>
          <Col sm={12} md={6} lg={4} style={{padding: "0px"}}>
            <div style={{height: "128px"}}>
              <ConfirmDisplay phraseInfo={this.props.currentCheck.phraseInfo}
                              phrase={this.props.currentCheck.phrase}
              />
            </div>
            <div style={{height: "262px"}}>
              <TranslationHelps currentFile={this.props.currentFile} />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}


module.exports = View;
