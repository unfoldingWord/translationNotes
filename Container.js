import React from 'react';
import View from './View.js';
import fetchData from './FetchData/main';
// String constants
const NAMESPACE = "translationNotes";

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true
    };
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps });
  }

  render() {
    let view = <div />;
    let { contextId } = this.props.contextIdReducer;
    if (contextId !== null) {
      view = <View
        {...this.props}
        title = {contextId.groupId}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    }
    return view;
  }
}

module.exports = {
  name: NAMESPACE,
  container: Container,
  fetchData: fetchData
};
