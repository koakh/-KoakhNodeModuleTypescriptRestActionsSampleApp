// tslint:disable: object-literal-sort-keys
import { GenericActions as GenericActionService } from '@koakh/typescript-rest-actions-api';
import { Request, Response } from 'express';
import { MainService } from '../services';
import { formatDate } from '../utils';

export class ViewController {
  constructor(private readonly genericActionsService: GenericActionService, private readonly mainService: MainService) { }

  public doc = async (req: Request, res: Response) => {
    try {
      // filtered
      // const payload = { body: { action: GenericEventAction.ACTION_ACTION_LIST } };
      const data = await this.genericActionsService.genericEventActionActionList({});
      // const model = result.data.map((repo) => ({
      //   name: repo.name,
      //   url: repo.html_url,
      //   description: repo.description,
      // }));
      res.render('api', { page: 'api', apiKey: this.getApyKey(req), model: data });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  // TODO: reverse order, paging, filter by action, error and result, and other fields, default limits to x records
  // TODO: aggregate like grouped by ACTION, and with sums errors, results etc
  public audit = async (req: Request, res: Response) => {
    try {
      const data = await this.mainService.getAuditAll();
      const model = data.map((e) => ({
        id: e._id,
        action: e.action,
        payload: e.payload ? e.payload : undefined,
        error: e.error ? e.error : undefined,
        result: e.result ? e.result : undefined,
        formattedCreatedDate: formatDate(e.createdDate, true),
      }));
      res.render('audit', { page: 'audit', apiKey: this.getApyKey(req), model });
    } catch (error) {
      res.status(500).send({ error });
    }
  }

  private getApyKey = (req: Request) => {
    return (req.query.apiKey) ? req.query.apiKey : null;
  }
}
