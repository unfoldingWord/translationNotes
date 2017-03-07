/**
 * A more organic implementation of the Target Verse Display
 * Author: Luke Wilson
 */
const React = require('react');
const style = require('../css/style');
const SelectionHelpers = require('../utils/selectionHelpers')

class TargetVerseDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      inBox: false
    }
  }

  getSelectionText() {
    let verseText = this.props.verse;
    let text = "";
    var selection = window.getSelection();
    var indexOfTextSelection = selection.getRangeAt(0).startOffset;
    if (selection) {
      text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
      text = document.selection.createRange().text;
    }
    if (text === "" || text === " ") {
      //do nothing since an empty space was selected
    } else {
      let expression = '/' + text + '/g';
      let wordOccurencesArray = verseText.match(eval(expression));
      let occurrences = wordOccurencesArray.length;
      let occurrence;
      let textBeforeSelection = verseText.slice(0, indexOfTextSelection);
      if (textBeforeSelection.match(eval(expression))) {
        occurrence = textBeforeSelection.match(eval(expression)).length + 1;
      } else {
        occurrence = 1;
      }

      let selectedText = {
        text: text,
        occurrence: occurrence,
        occurrences: occurrences
      };
      let newSelectedTextArray = this.props.currentCheck.selectedText;
      let foundRepeatedSelection = newSelectedTextArray.find(item => item.text === text && item.occurrence === occurrence);
      if (foundRepeatedSelection) {
        //dont add object to array
      } else {
        newSelectedTextArray.push(selectedText);
      }
      let currentCheck = this.props.currentCheck;
      // optimize the selections to address potential issues and save
      currentCheck.selectedText = SelectionHelpers.optimizeSelections(verseText, newSelectedTextArray);
      this.props.updateCurrentCheck(currentCheck);
    }
  }

  removeSelection(selectionObject) {
    var newSelectedTextArray = [];
    var currentCheck = this.props.currentCheck;
    newSelectedTextArray = currentCheck.selectedText.filter(selection =>
      selection.occurrence !== selectionObject.occurrence || selection.text !== selectionObject.text
    )
    // optimize the selections to address potential issues and save
    currentCheck.selectedText = SelectionHelpers.optimizeSelections(this.props.verse, newSelectedTextArray);
    this.props.updateCurrentCheck(currentCheck);
  }

  displayText() {
    let verseText = '';
    let { currentCheck } = this.props;
    if (currentCheck.selectedText && currentCheck.selectedText.length > 0) {
      var selectionArray = SelectionHelpers.selectionArray(this.props.verse, currentCheck.selectedText)
      verseText = selectionArray.map((selection, index) =>
        <span key={index} style={selection.selected ? { backgroundColor: '#FDD910', cursor: 'pointer', fontWeight: 'bold' } : {}}
          onClick={selection.selected ? () => this.removeSelection(selection) : () => { }}>
          {selection.text}
        </span>
      )

      return (
        <span onMouseUp={() => this.getSelectionText()} onMouseLeave={()=>this.inDisplayBox(false)} onMouseEnter={()=>this.inDisplayBox(true)}>
          {verseText}
        </span>
      );
    } else {
      verseText = this.props.verse;
      return (
        <span onMouseUp={() => this.getSelectionText()} onMouseLeave={()=>this.inDisplayBox(false)} onMouseEnter={()=>this.inDisplayBox(true)}>
          {verseText}
        </span>
      );
    }
  }
  

  inDisplayBox(insideDisplayBox) {
    this.setState({ inBox: insideDisplayBox });
    if (!insideDisplayBox && Math.abs(window.getSelection().extentOffset - window.getSelection().baseOffset) > 0) {
      this.getSelectionText()
    }
    window.getSelection().empty();
  }
  render() {
    let { chapter, verse } = this.props.currentCheck;
    return (
      <div style={style.targetVerseDisplayContent}>
        <div style={{ direction: this.props.direction }}>
          {chapter + ":" + verse + " "}{this.displayText()}
        </div>
      </div>
    )
  }

}

module.exports = TargetVerseDisplay;