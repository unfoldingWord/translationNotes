//CheckInfoCard.js//
/**
 * @author Ian Hoegen
 * @description This component is a display component for the Check Info Cards.
 */
const React = api.React;
const RB = api.ReactBootstrap;
const {Row, Glyphicon, Col} = RB;
const styles = require('../css/style.js');
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class CheckInfoCard extends React.Component {
    render() {
      var phraseInfo = this.props.file;
      if(phraseInfo){
        phraseInfo = phraseInfo.replace(/\(See:.*/g,"");
      }
      return (
        <div style={{margin: '10px'}}>
        <Card zDepth={2} style={{ background: '#03A9F4', padding: "20px"}}>
          <Row>
            <Col md={4} style={{borderRight: '1px solid #FFFFFF'}}>
              <div style={styles.title}>
                {this.props.title}
              </div>
            </Col>
            <Col md ={8}>
              <div style={{color: '#FFFFFF'}}>
                {phraseInfo}
              </div>
              <div onClick={this.props.showHelps ? null : this.props.openHelps}
              style={this.props.showHelps ? styles.linkInactive : styles.linkActive}>
              See More: {this.props.phraseTitle}
              </div>
            </Col>
          </Row>
        </Card>
        </div>
      );
    }
}

module.exports = CheckInfoCard;
