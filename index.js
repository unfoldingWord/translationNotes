import path from 'path';
import { connectTool } from 'tc-tool';
import {
  Api,
  Container,
  reducers,
} from 'checking-tool-wrapper';

export default connectTool('translationNotes', {
  localeDir: path.join(__dirname, './src/locale'),
  api: new Api(),
  reducer: reducers,
})(Container);
