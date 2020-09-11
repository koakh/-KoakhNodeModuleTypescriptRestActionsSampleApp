import fs from 'fs';
import { IncomingMessage } from 'http';
import https from 'https';
import request from 'request';
import c from '../config/constants';

/**
 * required to override problem: error TS2345: Argument of type 'Buffer' is not assignable to parameter of type 'string
 */
declare global {
  interface JSON {
    parse(text: Buffer, reviver?: (key: any, value: any) => any): any;
  }
}

/**
 * shared helper function to use in requests
 * always use paths started with slash
 */
const httpRequest = (options: any, payload: any) => new Promise((resolve, reject) => {
  try {
    const showLog: boolean = false;
    const rejectOnStatusCodes: boolean = false;
    const { path }: { path: string } = options;

    // assign default timeout, if undefined, not sent from function caller
    if (!options.timeout) {
      options.timeout = c.HTTP_REQUEST_DEFAULT_TIMEOUT;
    }

    // protection before request, all paths must start with slash, else we have a wrong endpoint call
    if (!path.startsWith('/')) {
      throw new Error(`invalid httpRequest path '${path}'. all httpRequest paths must start with slash! ex /ping`);
    }

    const req = https.request(options, (res: IncomingMessage) => {
      // init chunks array
      const chunks: any = [];

      if (showLog) {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
        console.log('options', JSON.stringify(options, undefined, 2));
        console.log('payload', JSON.stringify(payload, undefined, 2));
      }

      // reject on bad status
      if (rejectOnStatusCodes && (res.statusCode < 200 || res.statusCode >= 300)) {
        reject(res.statusCode);
      }

      // response event data
      res.on('data', (data) => {
        chunks.push(data);
      });

      // response event end
      res.on('end', () => {
        try {
          // prevent Typescript error TS2345 Error: TS2345:Argument of type 'Buffer' is not assignable to parameter of type 'string'
          // prevent convert empty chunks ARRAY with JSON.parse
          let responseObject: any = (chunks !== [])
            ? JSON.parse(Buffer.concat(chunks))
            : {};
          // add statusCode to responseObject, if is not in response, this way we don't override custom responses statusCode
          if (!('statusCode' in responseObject)) {
            responseObject = { ...responseObject, statusCode: res.statusCode };
          }
          resolve(responseObject);
        } catch (err) {
          reject(err);
        }
      });
    });

    // request event error
    req.on('error', (error) => {
      reject(error);
    });

    // trigger request: only send payload if exists
    if (payload) {
      const postData = JSON.stringify(payload);
      req.write(postData);
    }
    req.end();
  } catch (error) {
    reject(error);
  }
});

/**
 * request a file helper
 */
export const requestFile = async (uri: string, targetFilename: string, headers: any = {}): Promise<any> => {
  // create an empty file where we can save data
  const file = fs.createWriteStream(`${c.REQUEST_DOWNLOAD_PATH}/${targetFilename}`);
  // using promises so that we can use the ASYNC AWAIT syntax
  return await new Promise((resolve, reject) => {
    // fire request
    const stream = request({
      // exact link to the file to download
      uri,
      // tslint:disable-next-line: object-literal-sort-keys
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9,fr;q=0.8,ro;q=0.7,ru;q=0.6,la;q=0.5,pt;q=0.4,de;q=0.3',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36',
        // override with custom headers, ex authorization
        ...headers,
      },
      // gzip true for most of the websites now, disable it if you don't need it
      gzip: true,
    })
      .pipe(file)
      .on('finish', () => {
        resolve({ message: 'The file is finished downloading' });
      })
      .on('error', (error) => {
        reject(error);
      });
  })
    .catch((error) => {
      console.log(error);
    });
};
