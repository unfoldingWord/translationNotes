/* eslint-env jest */
import Api from '../Api';

describe('load check data', () => {
  it('returns older data in favor of context match', () => {
    const api = new Api();
    const contextId = {
      reference: {bookId: 'tit', chapter: 1, verse: 1},
      groupId: 'figs_metaphor',
      quote: 'that he put before them',
      occurrence: 1
    };
    const project = {
      dataPathExistsSync: jest.fn(),
      readDataDirSync: jest.fn(),
      readDataFileSync: jest.fn()
    };
    api.props = {
      tc: {
        project
      }
    };

    project.dataPathExistsSync.mockReturnValueOnce(true);
    project.readDataDirSync.mockReturnValueOnce(
      ['2018-12-18T21_28_18.837Z.json', '2019-01-10T03_59_47.588Z.json']);
    project.readDataFileSync.mockReturnValueOnce(
      JSON.stringify(
        {contextId: {groupId: 'hmmm', quote: 'hello', occurrence: 2}}));
    project.readDataFileSync.mockReturnValueOnce(
      JSON.stringify(
        {
          contextId: {
            groupId: 'figs_metaphor',
            quote: 'that he put before them',
            occurrence: 1
          }
        }));

    const data = api._loadCheckData('invalidated', contextId);
    expect(data).toMatchSnapshot();
    expect(project.readDataFileSync.mock.calls[0]).
      toEqual(
        ['checkData/invalidated/tit/1/1/2019-01-10T03_59_47.588Z.json']);
  });

  it('returns latest data in favor of context match', () => {
    const api = new Api();
    const contextId = {
      reference: {bookId: 'tit', chapter: 1, verse: 1},
      groupId: 'figs_metaphor',
      quote: 'that he put before them',
      occurrence: 1
    };
    const project = {
      dataPathExistsSync: jest.fn(),
      readDataDirSync: jest.fn(),
      readDataFileSync: jest.fn()
    };
    api.props = {
      tc: {
        project
      }
    };

    project.dataPathExistsSync.mockReturnValueOnce(true);
    project.readDataDirSync.mockReturnValueOnce(
      ['2018-12-18T21_28_18.837Z.json', '2019-01-10T03_59_47.588Z.json']);
    project.readDataFileSync.mockReturnValueOnce(
      JSON.stringify(
        {
          contextId: {
            groupId: 'figs_metaphor',
            quote: 'that he put before them',
            occurrence: 1
          }
        }));
    project.readDataFileSync.mockReturnValueOnce(
      JSON.stringify(
        {contextId: {groupId: 'hmmm', quote: 'hello', occurrence: 2}}));
    const data = api._loadCheckData('invalidated', contextId);
    expect(data).toMatchSnapshot();
    expect(project.readDataFileSync.mock.calls[0]).
      toEqual(
        ['checkData/invalidated/tit/1/1/2019-01-10T03_59_47.588Z.json']);
  });
});

describe('alignment memory', () => {
  it('returns the alignment memory', () => {
    const api = new Api();
    api._loadBookSelections = jest.fn(() => {
      return {
        '1': {
          '1': [
            {
              contextId: {
                quote: 'hello'
              },
              selections: [
                {
                  text: 'world'
                }
              ]
            }
          ]
        }
      };
    });
    const memory = api.getAlignmentMemory();
    expect(memory).toEqual([
      {
        sourceText: 'hello',
        targetText: 'world'
      }
    ]);
  });
});

describe('selection data', () => {

  it('loads selection data from the disk', () => {
    // Replicates the file reader
    function* dataGenerator() {
      const data2 = JSON.stringify({
        contextId: {
          groupId: 'word',
          quote: 'hi'
        },
        selections: [
          {
            text: 'world'
          }
        ]
      });

      const data1 = JSON.stringify({
        contextId: {
          groupId: 'word',
          quote: 'hello'
        },
        selections: [
          {
            text: 'world'
          }
        ]
      });
      // TRICKY: files will be sorted in ascending order
      yield data2;
      yield data1;
      yield data1;
    }

    const api = new Api();
    const generator = dataGenerator();
    const props = {
      tc: {
        contextId: {reference: {bookId: 'book'}},
        projectDataPathExistsSync: jest.fn(() => true),
        readProjectDataSync: jest.fn(() => generator.next().value),
        readProjectDataDirSync: jest.fn(() => {
          return ['1.json', '1_dup.json', '2.json'];
        }),
        targetBook: {
          '1': {
            '1': {}
          }
        }
      }
    };
    const selections = api._loadBookSelections(props);
    expect(selections).toEqual({
      '1': {
        '1': [
          {
            contextId: {
              groupId: 'word',
              quote: 'hi'
            },
            selections: [
              {
                text: 'world'
              }
            ]
          },
          {
            contextId: {
              groupId: 'word',
              quote: 'hello'
            },
            selections: [
              {
                text: 'world'
              }
            ]
          }
        ]
      }
    });
  });
});
