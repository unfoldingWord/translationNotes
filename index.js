import path from 'path';
import { connectTool } from 'tc-tool';
import { enableBatching } from 'redux-batched-actions';
import {
  Api,
  Container,
  reducers,
} from 'checking-tool-wrapper';

export default connectTool('translationNotes', {
  localeDir: path.join(__dirname, './src/locale'),
  api: new Api(),
  reducer: enableBatching(reducers),
})(Container);
