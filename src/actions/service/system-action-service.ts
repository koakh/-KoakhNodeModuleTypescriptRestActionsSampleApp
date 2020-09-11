// tslint:disable: object-literal-sort-keys
import { ActionBaseClass, execShellCommand, ExecShellCommandResponse, GenericEventAction, GenericEventActionMapObject, GenericEventActionPayload, NOT_IMPLEMENTED } from '@koakh/typescript-rest-actions-api';
import { GenericEventAction as GenericEventActionLocal } from '../types';

export class SystemActionService extends ActionBaseClass {

  constructor() {
    super();
    this.initGenericEvenActionMap();
    // client type only: used this method ONLY in client types actions/client-type/*
    this.initGenericEventActionMapAll();
  }

  // init local module actions
  public initGenericEvenActionMap() {
    this.genericEventActionMap = new Map<string, GenericEventActionMapObject>([
      [GenericEventAction.ACTION_NOT_IMPLEMENTED, {
        disabled: true,
        func: this.genericEventActionServiceNameStub,
      }],
      [GenericEventActionLocal.ACTION_SHELL_SERVICE_SYSTEM_SERVICE, {
        func: this.genericEventActionSystemService,
        fireEvent: true,
        body: {
          required: true,
          description: 'systemd service commands',
          example: {
            payload: {
              body: {
                service: 'ssh',
                action: 'status',
                cwd: '/tmp [optional]',
                showLog: 'true|false [optional]',
              },
            },
          },
        },
      }],
    ]);
  }

  // init local module actions into final module genericEventActionMapAll
  public initGenericEventActionMapAll() {
    // combine all local module actions
    this.combineActions();
  }

  /**
   * ACTION_${SERVICE_NAME}_SERVICE_STUB
   */
  public genericEventActionServiceNameStub = (payload: GenericEventActionPayload) => {
    return new Promise((reject) => {
      reject(new Error(NOT_IMPLEMENTED));
    });
  }

  /**
   * ACTION_${SERVICE_NAME}_${SHELL_TEMPLATE}
   */
  private genericEventActionShellStub = (payload: GenericEventActionPayload): Promise<ExecShellCommandResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { cmd, args, cwd, showLog } = payload.body;
        const res: ExecShellCommandResponse = await execShellCommand(cmd, args, cwd, showLog);
        // resolve promise
        resolve(res);
      } catch (error) {
        // reject promise
        reject(error);
      }
    });
  }

  /**
   * ACTION_SHELL_SERVICE_SYSTEM_SERVICE
   */
  private genericEventActionSystemService = (payload: GenericEventActionPayload): Promise<ExecShellCommandResponse> => {
    return new Promise(async (resolve, reject) => {
      try {
        const { service, action, cwd, showLog } = payload.body;
        const res: ExecShellCommandResponse = await execShellCommand('service', [service, action], cwd, showLog);
        // resolve promise
        resolve(res);
      } catch (error) {
        // reject promise
        reject(error);
      }
    });
  }
}
