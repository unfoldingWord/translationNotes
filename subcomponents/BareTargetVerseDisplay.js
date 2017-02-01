/**
 * A more organic implementation of the Target Verse Display
 * Author: Luke Wilson
 */

const api = window.ModuleApi;
const React = api.React;
const ReactBootstrap = api.ReactBootstrap;
const Well = ReactBootstrap.Well;
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
        var checkIndex = api.getDataFromCheckStore('TranslationNotesChecker', 'currentCheckIndex');
        var groupIndex = api.getDataFromCheckStore('TranslationNotesChecker', 'currentGroupIndex');
        if(checkIndex != null && groupIndex != null){
            var check = api.getDataFromCheckStore('TranslationNotesChecker', 'groups')[groupIndex].checks[checkIndex];
            if(check && check.selectionRange){
                this.setState({
                    start: check.selectionRange[0],
                    end: check.selectionRange[1]
                });
            }
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

        let currentCheck = this.getCurrentCheck();
        currentCheck.selectionRange = [beginsAt, endsAt];
        api.saveProject();
    }

    getWords(){
        //More refactoring could remove this method but we need it because it is reffed
        //by our View.js for the translation Words app
        return [this.state.selection];
    }

    getCurrentCheck() {
        var groups = api.getDataFromCheckStore('TranslationNotesChecker', 'groups');
        var currentGroupIndex = api.getDataFromCheckStore('TranslationNotesChecker', 'currentGroupIndex');
        var currentCheckIndex = api.getDataFromCheckStore('TranslationNotesChecker', 'currentCheckIndex');
        var currentCheck = groups[currentGroupIndex]['checks'][currentCheckIndex];
        return currentCheck;
    }

    getHighlightedWords(){
        let chapterNumber = this.props.currentCheck.chapter;
        let verseNumber = this.props.currentCheck.verse;
        let verse = this.props.verse
        let range = this.getCurrentCheck().selectionRange;
        if(range){
            let before = verse.substring(0, range[0]);
            let highlighted = verse.substring(range[0], range[1]);
            let after = verse.substring(range[1], verse.length);
            return(
                <div>{chapterNumber + ":" + verseNumber + " "}
                    <span onMouseUp={() => this.textSelected("pre")}>
                        {before}
                    </span>
                    <span
                        style={{backgroundColor: 'yellow', fontWeight: 'bold'}}
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
                   {chapterNumber + ":" + verseNumber + " " + verse}
              </span>
            );
        }
    }

    render(){
      return (
          <div style={{
            padding: '9px',
            minHeight: '128px',
            direction: this.props.direction,
            width: '100%',
            marginBottom: '5px',
            WebkitUserSelect: 'text',
            userSelect: "none",
          }}>
              {/*This is the only way to use CSS psuedoclasses inline JSX*/}
              <style dangerouslySetInnerHTML={{
                  __html: [
                      '.highlighted::selection {',
                      '  background: yellow;',
                      '}'
                      ].join('\n')
                  }}>
              </style>
              <div className='highlighted' style={{}}>
                {this.getHighlightedWords()}
              </div>
          </div>
        )
    }

}

module.exports = TargetVerseDisplay;
