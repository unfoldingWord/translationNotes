//Api Consts
import React from 'react'
import View from './View.js'
//String constants
const NAMESPACE = "TranslationNotesChecker";
import FetchData from './FetchData/main'
const sectionList = require('./static/SectionList.json').sectionList;


class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      showHelps: true
    }
  }

  componentWillMount() {
    FetchData(this.props).then(this.props.actions.doneLoading);
    //This will make sure that the anything triggered by the 
    //DONE_LOADING action will be called at the right time.
    this.props.actions.isDataFetched(true);
    //This will make sure that the data will not be fetched twice when 
    //the component receives new props.
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentToolReducer.isDataFetched) {
      //This will make sure that the data will not be fetched twice
      FetchData(nextProps).then(this.props.actions.doneLoading);
      //This will make sure that the anything triggered by the 
      //DONE_LOADING action will be called at the right time.
      nextProps.actions.isDataFetched(true);
    }
  }

  toggleHelps() {
    this.setState({ showHelps: !this.state.showHelps });
  }

  currentFile(file, TranslationAcademyObject) {
    try{
      let currentFile = TranslationAcademyObject[file].file;
      let title = currentFile.match(/title: .*/);
      if (title) {
        title = ' ' + title[0].replace('title: ', '');
      } else {
        title = currentFile.match(/===== (.+) =====/g)[0].replace(/=/g, '');
      }
      currentFile = currentFile.replace(/---[\s\S]+---/g, '');
      currentFile = '<h1>' + title + '</h1> \n' + currentFile;
      return currentFile;
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
  container: Container
}
