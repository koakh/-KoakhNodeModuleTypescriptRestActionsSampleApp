// tslint:disable: object-literal-sort-keys
import { GenericActions as GenericActionService, GenericShellExecCommandPayload, getEnumKeyFromEnumValue, ProcessActionCallbackArguments } from '@koakh/typescript-rest-actions-api';
import { LogLevel } from '@koakh/typescript-simple-logger';
import { Connection } from 'mongoose';
import { App } from '../app';
import { MainServer } from '../main-server';
import { MainService } from '../services';
import { AuditPayload } from '../types';

export class ActionService {
  constructor(
    private readonly db: Connection,
    private readonly mainServer: MainServer,
    private readonly genericActionService: GenericActionService,
    private readonly mainService: MainService,
  ) { }

  public action = (payload: { action: string, payload: GenericShellExecCommandPayload }): Promise<any> => new Promise(async (resolve, reject) => {
    try {
      const { action, payload: actionPayload } = payload;
      // error delegated to catch
      const response: any = await this.genericActionService.processAction(action, actionPayload, this.callback);
      // else resolve promise
      resolve(response);
    } catch (error) {
      App.log(LogLevel.ERROR, error.message ? error.message : error);
      reject(error);
    }
  })

  private callback = async (args: ProcessActionCallbackArguments) => {
    try {
      App.log(LogLevel.INFO, `callback action: ${args.action}`);
      const payload: AuditPayload = {
        action: args.action,
        payload: args.payload,
        result: args.result ? args.result : undefined,
        error: args.error ? args.error : undefined,
      };
      const document = await this.mainService.createAudit(payload).catch((error) => { throw error; });
    } catch (error) {
      const message = error.message ? error.message : error;
      App.log(LogLevel.ERROR, `callback action: ${message}`);
    }
  }
}
