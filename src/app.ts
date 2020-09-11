import { ActionBaseInterface, GenericActions as GenericActionService, GenericEventAction, GenericShellExecCommandPayload } from '@koakh/typescript-rest-actions-api';
import { Logger, LogLevel } from '@koakh/typescript-simple-logger';
import * as bodyParser from 'body-parser';
import express, { Application } from 'express';
import mongoose, { Connection } from 'mongoose';
import multer, { Instance as MulterInstance, StorageEngine } from 'multer';
import * as path from 'path';
import sanitize from 'sanitize-filename';
import { SystemActionService } from './actions/service/system-action-service';
import { GenericEventAction as GenericEventActionLocal } from './actions/types';
import c from './config/constants';
import { ActionController, MainController, ViewController } from './controllers';
import { MainServer } from './main-server';
import { allowCrossDomainMiddleware } from './middleware/allow-cross-domain-middleware';
import { redirectMiddleware } from './middleware/redirect-middleware';
import { expressTokenGuardMiddleware } from './middleware/token-guard-middleware';
import { MainRoute } from './routes/main-route';
import { ActionService, MainService } from './services';
import { isDirectory, mkDirectory } from './utils';

// used on debug mode to prevent: 'Node.js request CERT_HAS_EXPIRED', used in .env
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export class App {
  // static
  public static log(logLevel: LogLevel, message: string | object) {
    App.logger.log(logLevel, message);
  }
  private static logger: Logger = new Logger(c.LOG_LEVEL, c.LOG_FILE_PATH);
  // private properties
  private expressApp: Application;
  private mainServer: MainServer;
  // services
  private mainService: MainService;
  private actionService: ActionService;
  private genericActionsService: GenericActionService;
  // controllers
  private mainController: MainController;
  private actionController: ActionController;
  private viewController: ViewController;
  // routes
  private mainRoute: MainRoute;
  // dataConnection
  private db: Connection;
  // multerStorage: StorageEngine;
  private multerMiddleware: MulterInstance;

  constructor() {
    // init express server
    this.expressApp = express();

    // middleware
    this.configMiddleware();
    // multer
    if (c.MULTER_INIT === true) { this.initMulter(); }
    // setup mongoose
    if (c.MONGO_INIT === true) { this.initMongo(); }
    // init genericActions
    this.initGenericActions();
    // setup main http server
    this.mainServer = new MainServer(this.expressApp);
    // services
    this.mainService = new MainService(this.db, this.mainServer);
    this.actionService = new ActionService(this.db, this.mainServer, this.genericActionsService, this.mainService);
    // controllers
    this.mainController = new MainController(this.mainService);
    this.actionController = new ActionController(this.actionService);
    this.viewController = new ViewController(this.genericActionsService, this.mainService);
    // routes
    this.mainRoute = new MainRoute(this.expressApp, this.mainController, this.actionController, this.viewController, this.multerMiddleware);
  }

  // middleware
  private configMiddleware(): void {
    // redirect
    this.expressApp.use(redirectMiddleware);
    // custom cors
    this.expressApp.use(allowCrossDomainMiddleware);
    // tokenGuard
    this.expressApp.use(expressTokenGuardMiddleware);
    // application/json type post data
    this.expressApp.use(bodyParser.json());
    // application/x-www-form-urlencoded post data
    this.expressApp.use(bodyParser.urlencoded({ extended: true }));
    // ejs template engine
    this.expressApp.set('view engine', 'ejs').use(express.static(path.join(__dirname, '..', '/public')));
  }

  // multer
  private initMulter(): void {
    (async () => {
      // create directory if not exists, without wai for it
      if (!await isDirectory(c.DOWNLOAD_PATH)) {
        mkDirectory(c.DOWNLOAD_PATH);
      }
    })();
    // config multer storage
    const multerStorage: StorageEngine = multer.diskStorage({
      destination: (req: any, file: any, cb: any) => {
        cb(null, c.DOWNLOAD_PATH);
      },
      filename: (req: any, file: any, cb: any) => {
        const sanitizeFilename = sanitize(file.originalname).toLowerCase();
        cb(null, sanitizeFilename);
      },
    });
    this.multerMiddleware = multer({ storage: multerStorage });
  }

  private initMongo(): void {
    mongoose.connect(c.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
    // get connection
    this.db = mongoose.connection;
    this.db.on('error', console.error.bind(console, `MongoDB Connection error: ${c.MONGO_URL}`));
  }

  private async initGenericActions() {
    // test module base actions
    const test = false;
    // prepare local consumer actions service to pass to GenericActionService constructor
    const systemDActionService: SystemActionService = new SystemActionService();
    const actionsServices: ActionBaseInterface[] = [systemDActionService];
    // select module actions and combine it with local consumer actions
    const combinedGenericEventActions = [
      GenericEventAction.ACTION_ACTION_LIST,
      ...Object.keys(GenericEventActionLocal),
    ];
    // construct GenericActionService with local action services
    this.genericActionsService = new GenericActionService(actionsServices, combinedGenericEventActions, false);

    // fire tests
    if (test) {
      // test actionList
      const resActionList: any = await this.genericActionsService.processAction(GenericEventAction.ACTION_ACTION_LIST)
        .catch((error: any) => App.log(LogLevel.ERROR, error));
      App.log(LogLevel.DEBUG, resActionList);
      // test shellExec
      const payload: GenericShellExecCommandPayload = {
        body: {
          cmd: 'service',
          // tslint:disable-next-line: object-literal-sort-keys
          args: ['sshd', 'status'],
          // cwd: null,
          // showLog: false,
        },
      };
      const resShellExec: any = await this.genericActionsService.processAction(GenericEventAction.ACTION_SHELL_SERVICE_GENERIC_SHELL_EXEC, payload)
        .catch((error: any) => App.log(LogLevel.ERROR, error));
      App.log(LogLevel.DEBUG, resShellExec);
    }
  }
}

// export default new App().expressApp;
export default new App();
