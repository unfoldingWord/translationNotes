import Api from '../src/Api';
jest.mock('../src/helpers/validationHelpers.js', () => ({
  ...require.requireActual('../src/helpers/validationHelpers.js'),
  sameContext: () => false,
  getSelectionsFromChapterAndVerseCombo: jest.fn(() => {})
}));
jest.mock('fs-extra');
import * as validationHelpers from '../src/helpers/validationHelpers';

describe('api.validateBook', () => {
  it('should find that a verse has invalidated checks', () => {
    const spy = jest.spyOn(validationHelpers, 'getSelectionsFromChapterAndVerseCombo');
    const props = {
      tool: {
        name: 'translationWords',
        translate: key => key
      },
      tc: {
        targetBook: {
          '2': {
            '12': "It trains us, so that, rejecting asjfdas and worldly passions, we might live in a self-controlled and righteous and godly way in the present age, "
          }
        },
        contextId: {reference: {bookId: 'tit'}},
        username: 'royalsix',
        project: {
          _projectPath: 'my/project/path',
          getGroupData: jest.fn(() => {}),
          getCategoryGroupIds: jest.fn(() => {}),
          getGroupsData: jest.fn(() => ({
            accuse:
            [{"priority":1,"comments":false,"reminders":false,"selections":[{"text":"godlessness ","occurrence":1,"occurrences":1}],"verseEdits":false,"contextId":{"reference":{"bookId":"tit","chapter":2,"verse":12},"tool":"translationWords","groupId":"age","quote":"αἰῶνι","strong":["G01650"],"occurrence":1},"invalidated":false}]
          })),
        },
        showIgnorableDialog: jest.fn(() => {})
      }
    };
    const api = new Api();
    api.props = props;
    api.validateBook();
    expect(spy).toHaveBeenCalled();
  });
});