import React from 'react'
import { Glyphicon, Button, ButtonGroup, utils } from 'react-bootstrap'
import style from '../css/style'
//bootstrapUtils declaration
const bootstrapUtils = utils.bootstrapUtils;
bootstrapUtils.addStyle(Button, 'correct');
bootstrapUtils.addStyle(Button, 'flag');
bootstrapUtils.addStyle(Button, 'darkGrey');
bootstrapUtils.addStyle(Button, 'correctActive');
bootstrapUtils.addStyle(Button, 'flagActive');

class CheckStatusButtons extends React.Component{
  render(){
    let { currentCheck } = this.props;
    let { checkStatus } = currentCheck;
    return (
      <div style={{float: "right", right: "10px", position: "absolute"}}>
      <style type="text/css">
        {`
          .btn-correct {
            background-color: #747474;
            color: white;
          }
          .btn-flag {
            background-color: #747474;
            color: white;
          }
          .btn-darkGrey {
            background-color: #333333;
            color: white;
          }
          .btn-correct:hover {
            background-color: #4eba6f;
          }
          .btn-flag:hover {
            background-color: #fdd910;
          }
          .btn-correctActive {
            background-color: #4eba6f;
          }
          .btn-flagActive {
            background-color: #fdd910;
          }
          .btn-darkGrey:hover {
            background-color: #0277BD;
          }
          .btn:focus {
            outline: none
          }
        `}
      </style>
        <ButtonGroup style={style.checkStatusComponent.buttonGroup}>
          <Button bsStyle="darkGrey"
                  style={style.checkStatusComponent.buttonPrevious}
                  onClick={this.props.goToPrevious}
                  title="Click to go to the previous check">
            <Glyphicon glyph="chevron-up" style={style.buttonGlyphicons} />
          </Button>
          <Button bsStyle={checkStatus == 'CORRECT' ? 'correctActive': "correct"}
                  style={style.checkStatusComponent.buttons}
                  onClick={this.props.updateCheckStatus.bind(this, 'CORRECT')}
                  title="Click to mark as Correct in Context">
            <Glyphicon glyph="ok" style={style.buttonGlyphicons}/>
          </Button>
          <Button bsStyle={checkStatus == 'FLAGGED' ? 'flagActive': "flag"}
                  style={style.checkStatusComponent.buttons}
                  onClick={this.props.updateCheckStatus.bind(this, 'FLAGGED')}
                  title="Click to Flag for Review">
            <Glyphicon glyph="flag" style={style.buttonGlyphicons}/>
          </Button>
          <Button bsStyle="darkGrey"
                  style={style.checkStatusComponent.buttonNext}
                  onClick={this.props.goToNext}
                  title="Click to go to the next check">
            <Glyphicon glyph="chevron-down" style={style.buttonGlyphicons} />
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}

module.exports = CheckStatusButtons;
