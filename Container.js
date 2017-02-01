//Api Consts
const api = window.ModuleApi;
const React = require('react');
//Modules that are defined within translationNotes_Check_plugin
const View = require('./View.js');
//String constants
const NAMESPACE = "TranslationNotesChecker";

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      currentFile: null,
      tabKey: 1
    }
    this.saveProjectAndTimestamp = this.saveProjectAndTimestamp.bind(this);
    this.onCurrentCheckChange = this.onCurrentCheckChange.bind(this);
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
    api.Toast.info('Current check was marked as:', newCheckStatus, 2);
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
    let selectedWords = [];
    let idFound = false;
    if(currentCheck.selectedWordsRaw){
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
      selectedWords.push(wordObj);
      currentCheck.selectedWordsRaw = selectedWords;
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
    currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
    this.props.updateCurrentCheck(NAMESPACE, currentCheck);
    this.saveProjectAndTimestamp();
  }

  render(){
    let dragToSelect = false;
    if(api.getSettings('textSelect') === 'drag'){
      dragToSelect = true;
    }
    let proposedChangesStore = api.getDataFromCheckStore('ProposedChanges');
    let commentBoxStore = api.getDataFromCheckStore('CommentBox');
    let direction = api.getDataFromCommon('params').direction == 'ltr' ? 'ltr' : 'rtl';
    let gatewayVerse = '';
    let targetVerse = '';
    if(this.props.currentCheck){
      gatewayVerse = this.getVerse('gatewayLanguage');
      targetVerse = this.getVerse('targetLanguage');
    }
    var currentWord = this.props.groups[this.props.currentGroupIndex].group;
    var file = currentWord + ".md";
    var TranslationAcademyObject = api.getDataFromCheckStore('TranslationHelps', 'sectionList');
    let currentFile = TranslationAcademyObject[file].file;
    return (
      <View
        currentCheck={this.props.currentCheck}
        updateCurrentCheck={(newCurrentCheck, proposedChangesField) => {
          this.onCurrentCheckChange(newCurrentCheck, proposedChangesField)
        }}
        bookName={this.props.book}
        currentFile={currentFile}
        gatewayVerse={gatewayVerse}
        targetVerse={targetVerse}
        dragToSelect={dragToSelect}
        direction={direction}
        tabKey={this.state.tabKey}
        commentBoxStore={commentBoxStore}
        proposedChangesStore={proposedChangesStore}
        updateSelectedWords={this.updateSelectedWords.bind(this)}
        updateCheckStatus={this.updateCheckStatus.bind(this)}
        handleSelectTab={this.handleSelectTab.bind(this)}
        goToPrevious={this.goToPrevious.bind(this)}
        goToNext={this.goToNext.bind(this)}
      />
    );
  }
}


module.exports = {
  name: NAMESPACE,
  container: Container
}
