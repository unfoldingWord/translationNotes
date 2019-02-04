import Container from './src/Container';
import {connectTool} from 'tc-tool';
import path from 'path';
import Api from './src/Api';

export default connectTool('translationNotes', {
  localeDir: path.join(__dirname, './src/locale'),
  api: new Api()
})(Container);
