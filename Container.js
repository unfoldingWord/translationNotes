import React from 'react';
import View from './View.js';
import fetchData from './FetchData/main';
// String constants
const NAMESPACE = "translationNotes";
const sectionList = require('./static/SectionList.json').sectionList;


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

  currentFile(file, TranslationAcademyObject) {
    try{
      return TranslationAcademyObject[file].file;
    } catch (e) {
      return null;
    }
  }

  view() {
    let view = <div />
    let { contextId } = this.props.contextIdReducer;
    if (contextId !== null) {
      var group = contextId.groupId + ".md";
      let currentFile = this.currentFile(group, sectionList);
      view = <View
        {...this.props}
        currentFile={currentFile}
        dataList={sectionList}
        title = {contextId.groupId}
        showHelps={this.state.showHelps}
        toggleHelps={this.toggleHelps.bind(this)}
      />
    }
    return view;
  }

  render() {
    return (
      this.view()
    );
  }
}

module.exports = {
  name: NAMESPACE,
  container: Container,
  fetchData: fetchData
};
