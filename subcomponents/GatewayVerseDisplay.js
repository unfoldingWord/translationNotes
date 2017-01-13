///GatewayVerseDisplay.js//

const api = window.ModuleApi;
const React = api.React;
const ReactBootstrap = api.ReactBootstrap;

let natural = require('natural');
let XRegExp = require('xregexp');
let nonUnicodeLetter = XRegExp('\\PL');

//Wordlength tokenizer
const tokenizer = new natural.RegexpTokenizer({pattern: nonUnicodeLetter});

class GatewayVerseDisplay extends React.Component {

  generateWordArray() {
    let words = tokenizer.tokenize(this.props.gatewayVerse),
      wordArray = [],
      index = 0,
      tokenKey = 1,
      wordKey = 0;
    for (let word of words) {
      let wordIndex = this.props.gatewayVerse.indexOf(word, index);
      if (wordIndex > index) {
        wordArray.push(
          <span
            key={wordKey++}
            style={this.cursorPointerStyle}
          >
            {this.props.gatewayVerse.substring(index, wordIndex)}
          </span>
        );
      }
      wordArray.push(word);
      tokenKey++;
      index = wordIndex + word.length;
    }
    return wordArray;
  }

  render(){
    return (
      <div
        bsSize={'small'}
        style={{
          overflowY: "auto",
          minHeight: "128px",
          maxHeight: "128px",
          marginBottom: "2.5px",
          padding: '9px'
        }}
      >
        <h4 style={{marginTop: "0px"}}>
        {this.props.currentCheck.book
         + " " + this.props.currentCheck.chapter
         + ":" + this.props.currentCheck.gatewayVerse
         + (this.props.currentCheck.verseEnd ? "-"
         + this.props.currentCheck.verseEnd : "")}
        </h4>
        <span>
          {this.generateWordArray()}
        </span>
      </div>
    );
  }
}

module.exports = GatewayVerseDisplay;
