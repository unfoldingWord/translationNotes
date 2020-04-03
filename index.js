import path from 'path';
import { connectTool } from 'tc-tool';
import {
  Api,
  Container,
  reducers,
} from 'checking-tool-wrapper';

// Paths change when code is bundled w/ Webpack
const isProduction = process.env.NODE_ENV === 'production';
const STATIC_FOLDER_PATH = path.join(__dirname, 'static');// Path to static folder in webpacked code.
const localeDir = isProduction ? path.join(STATIC_FOLDER_PATH, 'tC_apps/translationNotes/src/locale') : path.join('./src/tC_apps/translationNotes/src/locale');

export default connectTool('translationNotes', {
  localeDir,
  api: new Api(),
  reducer: reducers,
})(Container);
