/**
 * A more organic implementation of the Target Verse Display
 * Author: Luke Wilson
 */
const React = require('react');
const style = require('../css/style');

class TargetVerseDisplay extends React.Component{
    constructor(){
        super();
        this.state = {
            selection: "",
            start: 0,
            end: 0
        }
        this.getSelectedWords = this.getSelectedWords.bind(this);
        this.textSelected = this.textSelected.bind(this);
        this.getWords = this.getWords.bind(this);
        this.clearSelection = this.getWords.bind(this);
    }

    componentWillMount(){
      this.getSelectedWords();
    }

    getSelectedWords(){
      let { currentCheck } = this.props;
      try{
        currentCheck.selectionRange
        this.setState({
            start: currentCheck.selectionRange[0],
            end: currentCheck.selectionRange[1]
        });
      }catch(e){

      }
    }

    clearSelection(){
        this.setState({
            selection: "",
            start: 0,
            end: 0
        });
    }

    textSelected(selectionRelativity){
        //We reset the state here so that you cant highlight
        //something that is already highlighted (which caus
        //es a bug where the highlighted text renders twice)
        this.clearSelection();
        var text = "";
        var selection = window.getSelection();
        if(selection) {
            text = selection.toString();
        } else if(document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }

        var beginsAt = selection.getRangeAt(0).startOffset;
        var endsAt = selection.getRangeAt(0).endOffset;

        if(selectionRelativity == "post"){
            beginsAt += this.state.end;
            endsAt += this.state.end;
        }

        if(selectionRelativity == "in"){
          beginsAt = 0;
          endsAt = 0;
          selection = "";
        }
        this.setState({
            selection: text,
            start: beginsAt,
            end: endsAt
        });
        let currentCheck = this.props.currentCheck;
        currentCheck.selectionRange = [beginsAt, endsAt];
        this.props.updateCurrentCheck(currentCheck);
    }

    getWords(){
        //More refactoring could remove this method but we need it because it is reffed
        //by our View.js for the translation Words app
        return [this.state.selection];
    }

    getHighlightedWords(){
        let { currentCheck, chapter, verse, selectionRange } = this.props.currentCheck;
        let verseText = this.props.verse;
        let range = selectionRange;
        if(range){
            let before = verseText.substring(0, range[0]);
            let highlighted = verseText.substring(range[0], range[1]);
            let after = verseText.substring(range[1], verseText.length);
            return(
                <div style={style.targetVerseDisplayContent}>
                    {chapter + ":" + verse + " "}
                    <span onMouseUp={() => this.textSelected("pre")}>
                        {before}
                    </span>
                    <span
                        style={{backgroundColor: '#FDD910', fontWeight: 'bold'}}
                        onMouseUp = {() => this.textSelected("in")}
                        >
                        {highlighted}
                    </span>
                    <span onMouseUp={() => this.textSelected("post")}>
                        {after}
                    </span>
                </div>
            )
        }else{
            return(
              <span onMouseUp={() => this.textSelected()}>
                   {chapter + ":" + verse + " " + verseText}
              </span>
            );
        }
    }
    render(){
      return (
          <div bsSize={'small'}
               style={{WebkitUserSelect: 'text', userSelect: "none"}}>
           {/*This is the only way to use CSS psuedoclasses inline JSX*/}
           <style dangerouslySetInnerHTML={{
               __html: [
                   '.highlighted::selection {',
                   '  background: #FDD910;',
                   '}'
                   ].join('\n')
               }}>
           </style>
            <div className='highlighted' style={{direction: this.props.direction}}>
                 {this.getHighlightedWords()}
            </div>
          </div>
        )
    }

}

module.exports = TargetVerseDisplay;
