//Api Consts
const api = window.ModuleApi;
import React from 'react'
import View from './View.js'
const fetchData = require('./FetchData.js');
//String constants
const NAMESPACE = "TranslationNotesChecker";

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      currentFile: null,
      tabKey: 1,
      showHelps: true
    }
    this.saveProjectAndTimestamp = this.saveProjectAndTimestamp.bind(this);
    this.onCurrentCheckChange = this.onCurrentCheckChange.bind(this);
  }

  componentWillMount() {
    console.log(this.props);
    const { projectDetailsReducer, actions } = this.props;
    const {addNewBible, addNewResource, progress, doneLoading} = actions;
    if (!this.props.currentToolReducer.isDataFetched) {
      fetchData(projectDetailsReducer.params, progress, doneLoading, addNewBible, addNewResource);
      this.props.actions.isDataFetched(true);
    }
  }

  componentDidMount() {
    this.addTargetLanguageToChecks();

  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.currentToolReducer.isDataFetched) {
      //This will make sure that the data will not be fetched twice
      const { projectDetailsReducer, actions } = nextProps;
      const {addNewBible, addNewResource, progress, doneLoading} = actions;
      fetchData(projectDetailsReducer.params, progress, doneLoading, addNewBible, addNewResource);
      //This will make sure that the anything triggered by the 
      //DONE_LOADING action will be called at the right time.
      nextProps.actions.isDataFetched(true);
    }
  }

  addTargetLanguageToChecks() {
    let groups = this.props.groups;
    var targetLanguage = api.getDataFromCommon('targetLanguage');
    for (var group in groups) {
      for (var item in groups[group].checks) {
        var co = groups[group].checks[item];
        try {
          var targetAtVerse = targetLanguage[co.chapter][co.verse];
          groups[group].checks[item].targetLanguage = targetAtVerse;
        } catch (err) {
          //Happens with incomplete books.
        }
      }
    }
    api.putDataInCheckStore(NAMESPACE, 'groups', groups);
  }

  saveProjectAndTimestamp(){
    let { currentCheck, userdata, currentGroupIndex, currentCheckIndex} = this.props;
    let currentUser;
    if(userdata){
      currentUser = userdata.username;
    }else {
      currentUser = "unknown";
    }
    let timestamp = new Date();
    currentCheck.user = currentUser;
    currentCheck.timestamp = timestamp;
    var commitMessage = 'user: ' + currentUser + ', namespace: ' + NAMESPACE +
      ', group: ' + currentGroupIndex + ', check: ' + currentCheckIndex;
    this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    api.saveProject(commitMessage);
  }

  /**
   * @description - updates the status of the current check in the
   * checkStoreReducer
   * @param {object} newCheckStatus - the new check status for the check
   */
  updateCheckStatus(newCheckStatus) {
    let { currentCheck, currentGroupIndex, currentCheckIndex } = this.props;
    if (currentCheck.checkStatus) {
      if(currentCheck.checkStatus === newCheckStatus){
        currentCheck.checkStatus = "UNCHECKED";
        newCheckStatus = "UNCHECKED";
      }else {
        currentCheck.checkStatus = newCheckStatus;
      }
      api.emitEvent('changedCheckStatus', {
        groupIndex: currentGroupIndex,
        checkIndex: currentCheckIndex,
        checkStatus: newCheckStatus,
      });
      this.props.updateCurrentCheck(NAMESPACE, currentCheck);
      this.saveProjectAndTimestamp();
    }
    let message = 'Current check was marked as: ' + newCheckStatus;
    this.props.showNotification(message, 4);
    this.handleSelectTab(2);
  }

  updateSelectedWords(wordObj, remove) {
    let currentCheck = this.props.currentCheck;
    if(remove){
      this.removeFromSelectedWords(wordObj, currentCheck);
    }else{
      this.addSelectedWord(wordObj, currentCheck);
    }
  }

  addSelectedWord(wordObj, currentCheck){
    let idFound = false;
    if(currentCheck.selectedWordsRaw.length > 0){
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          idFound = true;
        }
      }
      if (!idFound) {
        currentCheck.selectedWordsRaw.push(wordObj);
        this.sortSelectedWords(currentCheck.selectedWordsRaw);
      }
    }else{
      currentCheck.selectedWordsRaw.push(wordObj);
    }
    this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  removeFromSelectedWords(wordObj, currentCheck) {
    let index = -1;
    if(currentCheck.selectedWordsRaw){
      for (var i in currentCheck.selectedWordsRaw) {
        if (currentCheck.selectedWordsRaw[i].key == wordObj.key) {
          index = i;
        }
      }
      if (index != -1) {
        currentCheck.selectedWordsRaw.splice(index, 1);
      }
    }
    this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  sortSelectedWords(selectedWords) {
    selectedWords.sort(function(first, next) {
      return first.key - next.key;
    });
  }

  getVerse(language) {
    var currentCheck = this.props.currentCheck;
    var currentVerseNumber = currentCheck.verse;
    var verseEnd = currentCheck.verseEnd || currentVerseNumber;
    var currentChapterNumber = currentCheck.chapter;
    var desiredLanguage = api.getDataFromCommon(language);
    try {
      if (desiredLanguage) {
        let verse = "";
        for (let v = currentVerseNumber; v <= verseEnd; v++) {
          verse += (desiredLanguage[currentChapterNumber][v] + " \n ");
        }
        return verse;
      }
    }
    catch (e) {
    }
  }

  goToPrevious() {
    this.props.handleGoToPrevious(NAMESPACE);
  }

  goToNext() {
    this.props.handleGoToNext(NAMESPACE);
  }

  handleSelectTab(tabKey){
     this.setState({tabKey});
  }

  onCurrentCheckChange(newCurrentCheck, proposedChangesField){
    let currentCheck = this.props.currentCheck;
    currentCheck.proposedChanges = newCurrentCheck.proposedChanges;
    currentCheck.comment = newCurrentCheck.comment;
    if(proposedChangesField){
      currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
    }
    this.currentCheck = currentCheck;
    this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  toggleHelps(){
    this.setState({showHelps: !this.state.showHelps});
  }

  currentFile(file, TranslationAcademyObject) {
    try{
      let currentFile = TranslationAcademyObject[file].file;
      let title = currentFile.match(/title: .*/)[0].replace('title: ', '');
      currentFile = currentFile.replace(/---[\s\S]+---/g, '');
      currentFile = '## ' + title + '\n' + currentFile;
      return currentFile;
    }catch (e) {
      return null;
    }
  }

  view() {
    let view = <div />
    let { contextId } = this.props.contextIdReducer;
    let { translationNotes } = this.props.resourcesReducer;
    if (!contextId) {
      contextId = {
        contextId: {
          quote: "This is the quote",
          reference: {
            chapter: 1,
            verse: 1, 
            book: 'eph'
          }
        },
        groupId: "translate_hebrewmonths",
      }
    }
    if (contextId !== null) {
      var group = contextId.groupId + ".md";
      let currentFile = this.currentFile(group, translationNotes);
      let title = "Hello World";
      view = <View
        {...this.props}
        currentFile={currentFile}
        title = {title}
        updateSelectedWords={this.updateSelectedWords.bind(this)}
        updateCheckStatus={this.updateCheckStatus.bind(this)}
        handleSelectTab={this.handleSelectTab.bind(this)}
        goToPrevious={this.goToPrevious.bind(this)}
        goToNext={this.goToNext.bind(this)}
        showHelps={this.state.showHelps}
        contextIdReducer={contextId}
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
