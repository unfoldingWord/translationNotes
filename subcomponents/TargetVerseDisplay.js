///TargetVerseDisplay.js//
const React = require('react');
//const natural = require('natural');
const XRegExp = require('xregexp');
const nonUnicodeLetter = XRegExp('[^\\pL\\pM]+?');
const TargetWord = require('./TargetWord');
const style = require('../css/style');

//Wordlength tokenizer
//const tokenizer = new natural.RegexpTokenizer({pattern: nonUnicodeLetter});

class TargetVerseDisplay extends React.Component {

  generateWordArray() {
    let words = [];
    if (this.props.verse) {
      var tokens = this.props.verse.split(nonUnicodeLetter);
      let _sentence = this.props.verse;
      var response = "";
      tokens.forEach(function(token) {
        var regex = XRegExp('^(.*?)('+token+')');
        var match = _sentence.match(regex, '');
        _sentence = _sentence.replace(regex, '');
        words.push(match[1] + match[2]);
      })
    }else {
      words = [];
    }
    var wordArray = [];
    for (var index in words) {
      let highlighted = false;
      if(this.props.currentCheck.selectedWordsRaw){
       let selectedWordsRaw = this.props.currentCheck.selectedWordsRaw;
       for(var i in selectedWordsRaw){
         if(selectedWordsRaw[i].word === words[index] && selectedWordsRaw[i].key === index){
           highlighted = true;
         }
       }
      }
     let wordObj = {
       word: words[index],
       key: index,
     }
      wordArray.push(
        <TargetWord
          key={index}
          word={words[index]}
          wordObj={wordObj}
          highlighted={highlighted}
          updateSelectedWords={this.props.updateSelectedWords.bind(this)}
        />
      );
    }
    return wordArray;
  }

  render() {
    let { chapter, verse} = this.props.currentCheck;
    return (
      <div bsSize={'small'}
           style={style.targetVerseDisplayContent}>
        <div style={{direction: this.props.direction, width: "100%"}}
             onMouseUp={this.textSelected}>
             {chapter + ":" + verse + " "}{this.generateWordArray()}
        </div>
      </div>
    );
  }
}

module.exports = TargetVerseDisplay;
