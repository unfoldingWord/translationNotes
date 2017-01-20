
const api = window.ModuleApi;
const React = api.React;

class ConfirmDisplay extends React.Component{
  render(){
    return (
      <div style={{fontSize: "14px", color: "#FFFFFF", overflowY: "scroll", width: "100%", height: "100%"}}>
        <span style={{marginTop: "0px"}}>
          <strong>
            {'"' + this.props.phrase + '"'}
          </strong>
        </span><br />
        <span>
          {this.props.phraseInfo}
        </span>
      </div>
    );
  }
}


module.exports = ConfirmDisplay;
