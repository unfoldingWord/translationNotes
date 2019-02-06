import React from 'react';
import PropTypes from 'prop-types';
import {TranslationHelps} from 'tc-ui-toolkit';
// helpers
import * as tHelpsHelpers from '../helpers/tHelpsHelpers';

class TranslationHelpsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelpsModal: false,
      modalArticle: '',
      articleCategory: ''
    };

    this.toggleHelpsModal = this.toggleHelpsModal.bind(this);
    this.followTHelpsLink = this.followTHelpsLink.bind(this);
    window.followLink = this.followTHelpsLink;
  }

  componentWillMount() {
    this._reloadArticle(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {contextIdReducer, resourcesReducer} = this.props || {};
    const nextContextIDReducer = nextProps.contextIdReducer;
    if (contextIdReducer !== nextContextIDReducer) {
      this._reloadArticle(nextProps);
    }

    const {contextId} = contextIdReducer;
    const nextContextId = nextContextIDReducer.contextId;

    const currentArticle = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId);
    const nextArticle = tHelpsHelpers.getArticleFromState(nextProps.resourcesReducer, nextContextId);
    if (currentArticle !== nextArticle) {
      var page = document.getElementById("helpsbody");
      if (page) page.scrollTop = 0;
    }
  }

  toggleHelpsModal() {
    this.setState({
      showHelpsModal: !this.state.showHelpsModal,
      modalArticle: ''
    });
  }

  /**
   * Loads the resource article
   * @param props
   * @private
   */
  _reloadArticle(props) {
    const {contextIdReducer, toolsReducer, currentProjectToolsSelectedGL, actions} = props;
    const {contextId} = contextIdReducer;
    if (contextId) {
      const articleId = contextId.groupId;
      const {currentToolName} = toolsReducer;
      const languageId = currentProjectToolsSelectedGL[currentToolName];
      actions.loadResourceArticle(currentToolName, articleId, languageId);
    }
  }

  followTHelpsLink(link) {
    let linkParts = link.split('/'); // link format: <lang>/<resource>/<category>/<article>

    const [lang, type, category, article] = linkParts;
    const resourceDir = tHelpsHelpers.getResourceDirByType(type);

    this.props.actions.loadResourceArticle(resourceDir, article, lang, category);
    const articleData = this.props.resourcesReducer.translationHelps[resourceDir][article];

    let newState;
    const showHelpsModal = true;
    const articleCategory = category;
    if (articleData) {
      newState = {
        showHelpsModal,
        articleCategory,
        modalArticle: articleData
      };
    } else {
      newState = {
        showHelpsModal,
        articleCategory,
        modalArticle: 'Cannot find an article for ' + link
      };
    }
    //todo: Shouldn't need to to set state and return state in the same function
    // Seems like an anti pattern
    this.setState(newState);
    return newState;
  }

  render() {
    const {
      currentProjectToolsSelectedGL,
      toolsReducer: {currentToolName},
      resourcesReducer,
      contextIdReducer: {contextId},
      showHelps,
      toggleHelps,
      translate
    } = this.props;
    debugger;
    const languageId = currentProjectToolsSelectedGL[currentToolName];
    const currentFile = tHelpsHelpers.getArticleFromState(resourcesReducer, contextId);
    const currentFileMarkdown = tHelpsHelpers.convertMarkdownLinks(currentFile, languageId);
    const tHelpsModalMarkdown = tHelpsHelpers.convertMarkdownLinks(this.state.modalArticle, languageId, this.state.articleCategory);
    return (
      <TranslationHelps
        translate={translate}
        article={currentFileMarkdown}
        modalArticle={tHelpsModalMarkdown}
        openExpandedHelpsModal={() => this.toggleHelpsModal()}
        isShowHelpsSidebar={showHelps}
        sidebarToggle={toggleHelps}
        isShowHelpsExpanded={this.state.showHelpsModal} />
    );
  }
}

TranslationHelpsContainer.propTypes = {
  currentProjectToolsSelectedGL: PropTypes.object,
  translate: PropTypes.func,
  resourcesReducer: PropTypes.object,
  contextIdReducer: PropTypes.shape({
    contextId: PropTypes.object.isRequired
  }),
  toolsReducer: PropTypes.object,
  actions: PropTypes.shape({
    loadResourceArticle: PropTypes.func.isRequired,
  }),
  showHelps: PropTypes.bool.isRequired,
  toggleHelps: PropTypes.func.isRequired,
};

export default TranslationHelpsContainer;
