import { Request, Response } from 'express';
import { ActionService } from '../services';

export class ActionController {
  constructor(private readonly actionService: ActionService) { }

  public action = async (req: Request, res: Response) => {
    try {
      const { body: payload }: { body: any } = req;
      // error delegated to catch
      const result = await this.actionService.action(payload);
      // else resolve promise
      res.send(result);
    } catch (error) {
      res.status(500).send({ error });
    }
  }
}
