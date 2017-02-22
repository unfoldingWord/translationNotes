const React = require('react');

/* Contains a word from the target language, defines a lot of listeners for clicks */
class TargetWord extends React.Component {
    render() {
      return (
        <span
          className={this.props.highlighted ? 'text-primary-highlighted' : ''}
          onClick={this.props.updateSelectedWords.bind(this, this.props.wordObj, this.props.highlighted)}
          style={{cursor: 'pointer'}}
        >
          {this.props.word}
        </span>
      );
    }
}

module.exports = TargetWord;
