/** @file CheckInfoCard.js
 * @description This component is a display component for the Check Info Cards.
 */
import React from 'react'
import styles from '../css/style.js'

class CheckInfoCard extends React.Component {
    render() {
      let phraseInfo = this.props.file;
      if(phraseInfo){
        phraseInfo = phraseInfo.replace(/\(See:.*/g,"");
      }
      return (
        <div style={styles.checkInfo}>
          <div style={styles.leftSide}>
              <div style={styles.title}>
                  {this.props.title}
              </div>
          </div>
          <div style={styles.rightSide}>
            <div style={styles.phrase}>
              {phraseInfo}
            </div>
            <div onClick={this.props.showHelps ? null : this.props.openHelps}
                 style={this.props.showHelps ? styles.linkInactive : styles.linkActive}>
              See: {this.props.phraseTitle}
            </div>
          </div>
        </div>
      );
    }
}

module.exports = CheckInfoCard;
