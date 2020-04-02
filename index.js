import path from 'path';
import { connectTool, configureReduxLogger } from 'tc-tool';
import {
  Api,
  Container,
  reducers,
} from 'checking-tool-wrapper';

const reduxLoggerConfig = { // set up default configuration

  // Predefined limits are:
  // configureReduxLogger.LIMIT_STRINGIFY - configuration to limit nesting to this depth, anything deeper is stringified
  // configureReduxLogger.LIMIT_NO_STRINGIFY - configuration to limit nesting to this depth, anything deeper is replaced with depthLimitString
  // configureReduxLogger.LIMIT_NONE - configuration to not limit nesting for reducer - it is logged unmodified
  // configureReduxLogger.SKIP_LOGGING - configuration to skip log a reducer

  // Add limits for specific reducers - the reducers here are both large and deeply nested
  // and will crash the react devTools console if not limited.
  limitReducers: {
    groupsDataReducer: configureReduxLogger.SKIP_LOGGING, // configureReduxLogger.LIMIT_STRINGIFY,
  },

  // default setting for reducers not specified in limitReducers, set this to SKIP_LOGGING to skip logging of any reducer not in limitReducers
  defaultLimit: configureReduxLogger.LIMIT_NONE,

  // string to log when depth limit is reached and we don't want to stringify
  depthLimitString: '…',

  // settings for action transformer
  actionDepth: 3,
  actionStringify: false,
};

console.log(`TN configureReduxLogger = ${JSON.stringify(configureReduxLogger)}`);

export default connectTool('translationNotes', {
  localeDir: path.join('./src/tC_apps/translationNotes/src/locale'),
  api: new Api(),
  reducer: reducers,
  reduxLogger: reduxLoggerConfig,
})(Container);
