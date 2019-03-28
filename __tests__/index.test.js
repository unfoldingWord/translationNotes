import translationNotes from '../index';

describe('Testing tool index.js', () => {
  test('Should return an object with all the required fields', () => {
    expect(Object.keys(translationNotes)).toEqual(['name', 'api', 'tool_interface_version', 'container']);
    expect(translationNotes.name).toBeDefined();
    expect(translationNotes.api).toBeDefined();
    expect(translationNotes.tool_interface_version).toBeDefined();
    expect(translationNotes.container).toBeDefined();
  });

  test('Should return the correct tool name', () => {
    expect(translationNotes.name).toEqual('translationNotes');
  });
});
