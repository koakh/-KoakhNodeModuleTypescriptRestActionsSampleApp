import { Application } from 'express';
import { Instance as MulterInstance } from 'multer';
import c from '../config/constants';
import { ActionController, MainController, ViewController } from '../controllers';

export class MainRoute {

  constructor(
    private readonly app: Application,
    private readonly mainController: MainController,
    private readonly actionController: ActionController,
    private readonly viewController: ViewController,
    private readonly multer: MulterInstance) {
    // init routes
    this.routes(this.app);
  }

  private routes = (app: Application): void => {
    // mainController
    app.route('/api/audit')
      .post(this.mainController.createAudit)
      .get(this.mainController.getAuditAll);
    app.route('/api/audit/:auditId')
      .get(this.mainController.getAudit)
      .put(this.mainController.updateAudit)
      .delete(this.mainController.removeAudit);
    // upload/download
    if (c.MULTER_INIT === true) {
      app.route('/api/upload/')
        .post(this.multer.single('file'), this.mainController.uploadFile);
      app.route('/api/download/:file(*)')
        .get(this.mainController.downloadFile);
      app.route('/api/download-test')
        .get(this.mainController.testDownloadFile);
    }
    // actionController
    app.route('/api/action')
      .post(this.actionController.action);
    // viewController
    app.route('/doc')
      .get(this.viewController.doc);
    app.route('/audit')
      .get(this.viewController.audit);
  }
}
