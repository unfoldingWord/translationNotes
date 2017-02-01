///TargetVerseDisplay.js//
const React = require('react');
const natural = require('natural');
const XRegExp = require('xregexp');
const nonUnicodeLetter = XRegExp('\\PL');
const TargetWord = require('./TargetWord');
const style = require('../css/style');

//Wordlength tokenizer
const tokenizer = new natural.RegexpTokenizer({pattern: nonUnicodeLetter});

/* Contains a word from the target language, defines a lot of listeners for clicks */
class TargetVerseDisplay extends React.Component {

  generateWordArray() {
    if (this.props.verse) {
      var words = tokenizer.tokenize(this.props.verse);
    } else {
      var words = [];
    }
    var wordArray = [],
      index = 0,
      tokenKey = 1,
      wordKey = 0;
    for (var word of words) {
      var wordIndex = this.props.verse.indexOf(word, index);
      if (wordIndex > index) {
        wordArray.push(
          <span
            key={wordKey++}
            style={{cursor: 'pointer'}}
          >
            {this.props.verse.substring(index, wordIndex)}
          </span>
        );
      }
      let highlighted = false;
      if(this.props.currentCheck.selectedWordsRaw){
       let selectedWordsRaw = this.props.currentCheck.selectedWordsRaw;
       for(var foundWord in selectedWordsRaw){
         if(selectedWordsRaw[foundWord].word === word && selectedWordsRaw[foundWord].key === tokenKey){
           highlighted = true;
         }
       }
     }
     let wordObj = {
       word: word,
       key: tokenKey
     }
      wordArray.push(
        <TargetWord
          word={word}
          key={wordKey++}
          keyId={tokenKey}
          wordObj={wordObj}
          style={{cursor: 'pointer'}}
          highlighted={highlighted}
          updateSelectedWords={this.props.updateSelectedWords.bind(this)}
        />
      );
      tokenKey++;
      index = wordIndex + word.length;
    }
    return wordArray;
  }

  render() {
    let { chapter, verse} = this.props.currentCheck;
    return (
      <div bsSize={'small'}
           style={style.targetVerseDisplayContent}>
        <div style={{direction: this.props.direction}}
             onMouseUp={this.textSelected}>
             {chapter + ":" + verse + " "}{this.generateWordArray()}
        </div>
      </div>
    );
  }
}

module.exports = TargetVerseDisplay;
