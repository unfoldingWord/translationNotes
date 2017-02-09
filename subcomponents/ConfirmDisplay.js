
const api = window.ModuleApi;
const React = api.React;

class ConfirmDisplay extends React.Component{
  render(){
    var phraseInfo = this.props.phraseInfo;
    if(phraseInfo){
      phraseInfo = phraseInfo.replace(/\(See:.*/g,"");
    }
    return (
      <div style={{fontSize: "14px", color: "#FFFFFF", overflowY: "scroll", width: "100%", height: "100%"}}>
        <span style={{marginTop: "0px"}}>
          <strong>
            {'"' + this.props.phrase + '"'}
          </strong>
        </span><br />
        <span>
          {phraseInfo}
        </span>
      </div>
    );
  }
}


module.exports = ConfirmDisplay;
