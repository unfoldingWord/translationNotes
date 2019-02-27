import * as settingsHelper from '../src/helpers/settingsHelper';

const bibles = {
  hi: {
    ulb: []
  },
  en: {
    ult: []
  }
};

describe('settingsHelper.loadCorrectPaneSettings', () => {
  test('Should change the pane settings to render English ULT if Enslish is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: [
              {
                languageId: 'hi',
                bibleId: 'ulb'
              },
            ]
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'en',
        bibleId: 'ult'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should change the pane settings to render Hindi ULB if Hindi is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: [
              {
                languageId: 'en',
                bibleId: 'ult'
              },
            ]
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'hi',
        bibleId: 'ulb'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should render both Hindi ULB and English ULT if they are both currently in the pane settings', () => {
    const bothHindiAndEnglish = [
      {
        languageId: 'en',
        bibleId: 'ult'
      },
      {
        languageId: 'hi',
        bibleId: 'ulb'
      },
    ];
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: bothHindiAndEnglish
          }
        }
      }
    };
    const expectedResult = bothHindiAndEnglish;
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should render the English ULT if the pane settings is empty and English is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: []
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'en',
        bibleId: 'ult'
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should render the Hindi ULB if the pane settings is empty and Hindi is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'hi'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: []
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'hi',
        bibleId: 'ulb'
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });


  test('Should render the English ULT if the pane settings is empty and English is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {
            currentPaneSettings: []
          }
        }
      }
    };
    const expectedResult = [
      {
        languageId: 'en',
        bibleId: 'ult'
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should add the English ULT and target language in a fresh install if English is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'en'
        }
      },
      settingsReducer: {
        toolsSettings: {}
      }
    };
    const expectedResult = [
      {
        languageId: 'en',
        bibleId: 'ult'
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });

  test('Should add the Hindi ULB and target language in a fresh install if Hindi is selected as the GL', () => {
    const props = {
      tc: {
        selectedToolName: 'translationWords'
      },
      projectDetailsReducer: {
        currentProjectToolsSelectedGL: {
          translationWords: 'hi'
        }
      },
      settingsReducer: {
        toolsSettings: {}
      }
    };
    const expectedResult = [
      {
        languageId: 'hi',
        bibleId: 'ulb'
      },
      {
        languageId: 'targetLanguage',
        bibleId: 'targetBible'
      }
    ];
    settingsHelper.loadCorrectPaneSettings(props, (toolNamespace, settingsLabel, paneSettings) => {
      expect(paneSettings).toEqual(expectedResult);
    }, bibles);
  });
});
