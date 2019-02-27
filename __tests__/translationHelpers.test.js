/* eslint-env jest */
import * as translationHelper from '../src/helpers/translationHelper';

describe('translationHelper.stripTranslateProperty', () => {
  it('should remove only specific keys', () => {
    // given
    const props = {
      translate: {},
      currentToolViews: {},
      settingsReducer: {
        toolsSettings: {
          ScripturePane: {}
        },
        online: true
      },
      resourcesReducer: {
        translationHelps: {
          translationWords: {'group1': 'file'}
        }
      },
      contextIdReducer: {
        contextId: {
          groupId: 'group1',
          quote: 'title'
        }
      },
      title: 'title',
      toggleHelps: {},
      showHelps: {}
    };
    
    const duplicateProps = JSON.parse(JSON.stringify(props));
    delete duplicateProps['translate'];
    delete duplicateProps['showHelps'];
    const expectProps = duplicateProps;
    const remove = ['translate','showHelps'];
    
    // when
    const strippedProps = translationHelper.stripTranslateProperty(props, remove);
    
    // then
    expect(strippedProps).toEqual(expectProps);
  });
});
