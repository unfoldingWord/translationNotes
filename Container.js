//View.js//

//Api Consts
const api = window.ModuleApi;
const React = api.React;

//Modules not defined within translationNotes_Check_plugin
var ScripturePane = null;
var ProposedChanges = null;
var CommentBox = null;
var TranslationHelps = null;

//Modules that are defined within translationNotes_Check_plugin
const EventListeners = require('./ViewEventListeners.js');
const View = require('./View.js');

//String constants
const NAMESPACE = "TranslationNotesChecker",
      UNABLE_TO_FIND_LANGUAGE = "Unable to find language from the store";

class Container extends React.Component {
  constructor() {
    super();
    this.state = {
      currentCheck: null,
      currentTranslationWordFile: null,
      book: null,
      currentWord: null,
      currentFile: null,
      tabKey: 1
    }
    this.updateState = this.updateState.bind(this);
    this.changeCurrentCheckInCheckStore = this.changeCurrentCheckInCheckStore.bind(this);
    this.goToNextListener = EventListeners.goToNext.bind(this);
    this.goToPreviousListener = EventListeners.goToPrevious.bind(this);
    this.goToCheckListener = EventListeners.goToCheck.bind(this);
    this.changeCheckTypeListener = EventListeners.changeCheckType.bind(this);
  }

  componentWillMount() {
    api.registerEventListener('goToNext', this.goToNextListener);
    api.registerEventListener('goToPrevious', this.goToPreviousListener);
    api.registerEventListener('goToCheck', this.goToCheckListener);
    api.registerEventListener('changeCheckType', this.changeCheckTypeListener);
    api.registerEventListener('phraseDataLoaded', this.updateState);
    this.updateState();
  }

  componentDidMount() {
    //this should already be set in the state from componentWillMount
    var currentCheck = this.state.currentCheck;
    if (currentCheck) {
      //Let Scripture Pane know to scroll to are current verse
      api.emitEvent('goToVerse', { chapterNumber: currentCheck.chapter, verseNumber: currentCheck.verse });
    }
  }

  componentWillUnmount() {
    api.removeEventListener('goToNext', this.goToNextListener);
    api.removeEventListener('goToPrevious', this.goToPreviousListener);
    api.removeEventListener('goToCheck', this.goToCheckListener);
    api.removeEventListener('changeCheckType', this.changeCheckTypeListener);
    api.removeEventListener('phraseDataLoaded', this.updateState);
  }

  getCurrentCheck() {
    var groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    var currentCheck = groups[currentGroupIndex]['checks'][currentCheckIndex];
    this.setState(currentCheck);
    return currentCheck;
  }

  updateUserAndTimestamp() {
    let currentCheck = this.getCurrentCheck();
    let currentUser = api.getLoggedInUser();
    let timestamp = new Date();
    currentCheck.user = currentUser;
    currentCheck.timestamp = timestamp;
  }

  /**
   * @description - updates the status of the check that is the current check in the check store
   * @param {object} newCheckStatus - the new status chosen by the user
   */
  updateCheckStatus(newCheckStatus, selectedWords) {
    var groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    var currentCheck = groups[currentGroupIndex]['checks'][currentCheckIndex];
    if (currentCheck.checkStatus) {
      currentCheck.checkStatus = newCheckStatus;
      api.emitEvent('changedCheckStatus', {
        groupIndex: currentGroupIndex,
        checkIndex: currentCheckIndex,
        checkStatus: newCheckStatus,
      });
      this.updateUserAndTimestamp();
    }
    this.updateState();
    api.Toast.info('Current check was marked as:', newCheckStatus, 2);
  }

  updateSelectedWords(wordObj, remove) {
    let currentCheck = this.getCurrentCheck();
    if(remove){
      this.removeFromSelectedWords(wordObj, currentCheck);
    }else{
      this.addSelectedWord(wordObj, currentCheck);
    }
    this.updateState();
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
  }

  sortSelectedWords(selectedWords) {
    selectedWords.sort(function(first, next) {
      return first.key - next.key;
    });
  }


  /**
   * @description - This is used to change our current check index and group index within the store
   * @param {object} newGroupIndex - the group index of the check selected in the navigation menu
   * @param {ob1ject} newCheckIndex - the group index of the check selected in the navigation menu
   */
  changeCurrentCheckInCheckStore(newGroupIndex, newCheckIndex) {
    let currentCheck = this.getCurrentCheck();
    let loggedInUser = api.getLoggedInUser();
    let userName = loggedInUser ? loggedInUser.userName : 'GUEST_USER';
    let groups = api.getDataFromCheckStore(NAMESPACE, 'groups');
    let currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    let currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    //error check to make sure we're going to a legal group/check index
    if (newGroupIndex !== undefined && newCheckIndex !== undefined) {
      if (newGroupIndex < groups.length) {
        api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', newGroupIndex);
        if (newCheckIndex < groups[currentGroupIndex].checks.length) {
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', newCheckIndex);
        }
        /* In the case that we're incrementing the check and now we're out of bounds
         * of the group, we increment the group.
         */
        else if (newCheckIndex == groups[currentGroupIndex].checks.length &&
          currentGroupIndex < groups.length - 1) {
          api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', currentGroupIndex + 1);
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', 0);
        }
        /* In the case that we're decrementing the check and now we're out of bounds
          * of the group, we decrement the group.
          */
        else if (newCheckIndex == -1 && currentGroupIndex >= 0) {
          var newGroupLength = groups[currentGroupIndex - 1].checks.length;
          api.putDataInCheckStore(NAMESPACE, 'currentGroupIndex', currentGroupIndex - 1);
          api.putDataInCheckStore(NAMESPACE, 'currentCheckIndex', newGroupLength - 1);
        }
        //invalid indices: don't do anything else
        else {
          return;
        }
      }
    }
    //Save Project
    var commitMessage = 'user: ' + userName + ', namespace: ' + NAMESPACE +
      ', group: ' + currentGroupIndex + ', check: ' + currentCheckIndex;
    api.saveProject(commitMessage);
    //Display toast notification
    if(currentCheck.checkStatus){
      if(currentCheck.checkStatus !== 'UNCHECKED'){
        api.Toast.success('Check data was successfully saved', '', 2);
      }
    }
    // Update state to render the next check
    this.updateState();
  }

  /**
   * @description - This method grabs the information that is currently in the
   * store and uses it to update our state which in turn updates our view. This method is
   * typically called after the store is updated so that our view updates to the latest
   * data found in the store
   */
  updateState() {
    var currentGroupIndex = api.getDataFromCheckStore(NAMESPACE, 'currentGroupIndex');
    var currentCheckIndex = api.getDataFromCheckStore(NAMESPACE, 'currentCheckIndex');
    if (currentGroupIndex === null || currentCheckIndex === null) {
      console.warn("TranslationNotes Check wasn't able to retrieve it's indices");
      return;
    }
    var currentCheck = api.getDataFromCheckStore(NAMESPACE, 'groups')[currentGroupIndex]['checks'][currentCheckIndex];
    var currentWord = api.getDataFromCheckStore(NAMESPACE, 'groups')[currentGroupIndex].group;
    this.setState({
      book: api.getDataFromCheckStore(NAMESPACE, 'book'),
      currentCheck: currentCheck,
      currentWord: currentWord,
      currentFile: this.getFile(currentWord)
    });
    api.emitEvent('goToVerse', { chapterNumber: currentCheck.chapter, verseNumber: currentCheck.verse, verseEnd: currentCheck.verseEnd });
  }

  /**
   * @description - This retrieves the translationAcademy file from the store so that we
   * can pass it as a prop to the TranslationHelps
   */
  getFile(currentWord) {
    var TranslationAcademyObject = api.getDataFromCheckStore('TranslationHelps', 'sectionList');
    var file = currentWord + ".md";
    return TranslationAcademyObject[file].file;
  }

  getVerse(language) {
    var currentCheck = this.state.currentCheck;
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
    api.emitEvent('goToPrevious');
  }

  goToNext() {
    api.emitEvent('goToNext');
  }

  handleSelectTab(tabKey){
     this.setState({tabKey});
  }

  updateCurrentCheck(newCurrentCheck, proposedChangesField){
    let currentCheck = this.getCurrentCheck();
    currentCheck.proposedChanges = newCurrentCheck.proposedChanges;
    currentCheck.comment = newCurrentCheck.comment;
    currentCheck[proposedChangesField] = newCurrentCheck[proposedChangesField];
    api.saveProject();
  }

  render(){
    if (!this.state.currentCheck) {
      return (<div></div>);
    }
    else {
      let dragToSelect = false;
      if(api.getSettings('textSelect') === 'drag'){
        dragToSelect = true;
      }
      let bookName = api.getDataFromCommon("tcManifest").ts_project.name;
      let proposedChangesStore = api.getDataFromCheckStore('ProposedChanges');
      let commentBoxStore = api.getDataFromCheckStore('CommentBox');
      let direction = api.getDataFromCommon('params').direction == 'ltr' ? 'ltr' : 'rtl';
      let gatewayVerse = this.getVerse('gatewayLanguage');
      let targetVerse = this.getVerse('targetLanguage');
      return (
        <View
          currentCheck={this.state.currentCheck}
          updateCurrentCheck={this.updateCurrentCheck.bind(this)}
          bookName={bookName}
          currentFile={this.state.currentFile}
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
}


module.exports = {
  name: NAMESPACE,
  container: Container
}
