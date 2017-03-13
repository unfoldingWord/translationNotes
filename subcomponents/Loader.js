import React from 'react'
import { ProgressBar } from 'react-bootstrap'

class Loader extends React.Component{
  render(){
    return (
      <ProgressBar
        now={this.props.progress}
        style={{verticaAlign: 'middle'}}
      />
    );
  }
}

module.exports = Loader;
