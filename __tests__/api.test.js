import Api from '../src/Api';

describe('api.validateBook', () => {
  it('should find that a verse has invalidated checks', () => {
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
        changeSelections: jest.fn(() => {}),
        project: {
          getGroupData: jest.fn(() => {}),
          getCategoryGroupIds: jest.fn(() => {}),
          getGroupsData: jest.fn(() => ({
            accuse:
            [{"priority":1,"comments":false,"reminders":false,"selections":[{"text":"godlessness ","occurrence":1,"occurrences":1}],"verseEdits":false,"contextId":{"reference":{"bookId":"tit","chapter":2,"verse":12},"tool":"translationWords","groupId":"age","quote":"αἰῶνι","strong":["G01650"],"occurrence":1},"invalidated":false}]
          })),
        },
        showIgnorableAlert: jest.fn(() => {})
      }
    };
    const api = new Api();
    api.props = props;
    api.validateBook();
    expect(props.tc.showIgnorableAlert).toHaveBeenCalled();
    expect(props.tc.changeSelections).toHaveBeenCalled();
  });
});