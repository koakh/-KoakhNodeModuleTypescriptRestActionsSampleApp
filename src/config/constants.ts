// tslint:disable: object-literal-sort-keys

import { LogLevel } from '@koakh/typescript-simple-logger';
import { getEnumKeyFromEnumValue } from '../utils';

// env constants
const LOG_LEVEL: LogLevel = (process.env.LOG_LEVEL) ? getEnumKeyFromEnumValue(LogLevel, process.env.LOG_LEVEL) : LogLevel.ERROR;
const HTTP_SERVER_PORT: string = process.env.HTTP_SERVER_PORT || String(8080);
const HTTPS_SERVER_PORT: string = process.env.HTTPS_SERVER_PORT || String(8443);
const HTTP_REQUEST_DEFAULT_TIMEOUT: number = (process.env.HTTP_REQUEST_DEFAULT_TIMEOUT as unknown as number)  || 3000;
const MONGO_URL: string = process.env.MONGO_URL || 'mongodb://localhost/books';
const MONGO_INIT: boolean = (! process.env.MONGO_INIT || process.env.MONGO_INIT === 'true') ? true : false;
const MULTER_INIT: boolean = (! process.env.MULTER_INIT || process.env.MULTER_INIT === 'true') ? true : false;

// to prevent nodejs https request "unable to verify the first certificate",
// use fullchain.pem in production server with LE Certs in .env, common.env 'HTTPS_SERVER_CERT=fullchain.pem'
const HTTPS_SERVER_CERT: string = process.env.HTTPS_SERVER_CERT || 'server.crt';
const HTTPS_SERVER_KEY: string = process.env.HTTPS_SERVER_KEY || 'server.key';

// simple key for guard
const TOKEN_GUARD_KEY: string = process.env.TOKEN_GUARD_KEY || 'HIDDEN_USE_ENV';
// model names
const MODEL_NAME_AUDIT: string = 'Audit';
// unprotected paths
const CSS_PATH: string = '/css';
const JS_PATH: string = '/js';
const DOC_PATH: string = '/doc';
const AUDIT_PATH: string = '/audit';
// paths
const DOWNLOAD_PATH: string = 'download';
const REQUEST_DOWNLOAD_PATH: string = '/tmp';

// log filename
const LOG_FILE_PATH: string = process.env.LOG_FILE_PATH || 'server.log';

// export defaults
export default {
  LOG_LEVEL,
  HTTP_SERVER_PORT,
  HTTPS_SERVER_PORT,
  HTTP_REQUEST_DEFAULT_TIMEOUT,
  MONGO_URL,
  MONGO_INIT,
  MULTER_INIT,
  HTTPS_SERVER_CERT,
  HTTPS_SERVER_KEY,
  TOKEN_GUARD_KEY,
  MODEL_NAME_AUDIT,
  CSS_PATH,
  JS_PATH,
  DOC_PATH,
  AUDIT_PATH,
  DOWNLOAD_PATH,
  REQUEST_DOWNLOAD_PATH,
  LOG_FILE_PATH,
};
