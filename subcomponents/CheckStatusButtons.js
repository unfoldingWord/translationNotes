
const api = window.ModuleApi;
const React = api.React;
const RB = api.ReactBootstrap;
const {Glyphicon, Button, ButtonGroup} = RB;

const CORRECT = "Correct in Context",
      FLAGGED = "Flag for Review";

class CheckStatusButtons extends React.Component{

  constructor() {
    super();
    this.setFlagStateFunction = this.setFlagStateFunction.bind(this);
  }

  setFlagStateFunction(newCheckStatus){
    this.props.updateCheckStatus(newCheckStatus);
  }

  render(){
    var _this = this;
    let currentCheck = this.props.getCurrentCheck();
    let checkStatus = currentCheck.checkStatus;
    return (
      <div>
        <ButtonGroup style={{width:'100%', paddingBottom: "2.5px"}}>
          <Button style={{width:'50%'}} bsStyle="success" className={checkStatus == 'CORRECT' ? 'active':''} onClick={
            function() {_this.setFlagStateFunction('CORRECT');}}>
            <Glyphicon glyph="ok" /> {CORRECT}</Button>
          <Button style={{width:'50%'}} bsStyle="danger" className={checkStatus == 'FLAGGED' ? 'active':''} onClick={
            function() {_this.setFlagStateFunction('FLAGGED');}}>
            <Glyphicon glyph="flag" /> {FLAGGED}</Button>
        </ButtonGroup>
      </div>
    );
  }
}

module.exports = CheckStatusButtons;
