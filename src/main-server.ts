import { LogLevel } from '@koakh/typescript-simple-logger';
import { Application } from 'express';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import { App } from './app';
import c from './config/constants';
import { LogService } from './types';
import { calcElapsedTime, ElapsedTime } from './utils';

export class MainServer {
  // public before private stuff
  public static getElapsedTime(): ElapsedTime {
    return calcElapsedTime(this.startDate, new Date());
  }

  private static startDate: Date = new Date();
  private port: string;
  private httpServer: http.Server;
  private httpsServer: https.Server;

  constructor(private readonly expressApp: Application) {
    this.initHttpServer();
  }

  /**
   * proxy log function
   */
  private log(logLevel: LogLevel, message: string) {
    App.log(logLevel, `${LogService.HTTPS_SERVER} ${message}`);
  }

  private initHttpServer() {
    // compose https options
    const httpsOptions = {
      cert: fs.readFileSync(`./config/${c.HTTPS_SERVER_CERT}`),
      // a PEM containing the SERVER and ALL INTERMEDIATES to prevent
      // curl and insomnia 'SSL certificate problem: unable to get local issuer certificate' problems
      key: fs.readFileSync(`./config/${c.HTTPS_SERVER_KEY}`),
    };

    // start http express server
    this.httpServer = http
      .createServer(this.expressApp)
      .listen(c.HTTP_SERVER_PORT, () => {
        this.log(LogLevel.INFO, `HTTP Server running on port [${c.HTTP_SERVER_PORT}]`);
      });
    // start https express server
    this.httpsServer = https
      .createServer(httpsOptions, this.expressApp)
      .listen(c.HTTPS_SERVER_PORT, () => {
        this.log(LogLevel.INFO, `HTTPS Server running on port [${c.HTTPS_SERVER_PORT}]`);
        this.log(LogLevel.INFO, `using certificates: ${c.HTTPS_SERVER_CERT}:${c.HTTPS_SERVER_KEY}`);
      });
  }
}
