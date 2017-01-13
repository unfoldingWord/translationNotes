
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;
const {Glyphicon, Button, ButtonGroup} = RB;
const style = require('../css/style');

const CORRECT = "Correct in Context",
      FLAGGED = "Flag for Review";

class CheckStatusButtons extends React.Component{
  render(){
    let { currentCheck } = this.props;
    let { checkStatus } = currentCheck;
    return (
      <div>
        <ButtonGroup style={style.checkStatusComponent.buttonGroup}>
          <Button style={style.checkStatusComponent.buttons} bsStyle="success"
                  className={checkStatus == 'CORRECT' ? 'active':''}
                  onClick={this.props.updateCheckStatus.bind(this, 'CORRECT')}>
            <Glyphicon glyph="ok" /> {CORRECT}</Button>
          <Button style={style.checkStatusComponent.buttons} bsStyle="warning"
                  className={checkStatus == 'FLAGGED' ? 'active':''}
                  onClick={this.props.updateCheckStatus.bind(this, 'FLAGGED')}>
            <Glyphicon glyph="flag" /> {FLAGGED}</Button>
        </ButtonGroup>
      </div>
    );
  }
}

module.exports = CheckStatusButtons;
