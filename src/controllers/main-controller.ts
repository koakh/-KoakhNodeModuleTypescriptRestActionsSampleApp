import { Request, Response } from 'express';
import path from 'path';
import c from '../config/constants';
import { IAudit } from '../models/mongoose/audit.model';
import { MainService } from '../services';
import { AuditPayload, MongoDeletePayload, MongoUpdatePayload } from '../types';
import { fileExist } from '../utils';
import { requestFile } from '../utils/request';

export class MainController {
  constructor(private readonly mainService: MainService) { }

  public createAudit = async (req: Request, res: Response) => {
    try {
      const { body: payload }: { body: AuditPayload } = req;
      const document = await this.mainService.createAudit(payload).catch((error) => { throw error; });
      res.send(document);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  public getAuditAll = async (req: Request, res: Response) => {
    try {
      const documents: IAudit[] = await this.mainService.getAuditAll().catch((error) => { throw error; });
      res.send(documents);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  public getAudit = async (req: Request, res: Response) => {
    try {
      const { auditId }: { [auditId: string]: string } = req.params;
      const document: IAudit = await this.mainService.getAudit(auditId).catch((error) => { throw error; });
      res.send(document);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  public updateAudit = async (req: Request, res: Response) => {
    try {
      const { auditId }: { [auditId: string]: string } = req.params;
      const { body: payload }: { body: AuditPayload } = req;
      const result: MongoUpdatePayload = await this.mainService.updateAudit(auditId, payload).catch((error) => { throw error; });
      res.send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  public removeAudit = async (req: Request, res: Response) => {
    try {
      const { auditId }: { [auditId: string]: string } = req.params;
      const result: MongoDeletePayload = await this.mainService.removeAudit(auditId).catch((error) => { throw error; });
      res.status(204).send(result);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  public downloadFile = async (req: Request, res: Response) => {
    try {
      const { file }: { [file: string]: string } = req.params;
      const fileLocation = path.join(`./${c.DOWNLOAD_PATH}`, file);
      const exist = await fileExist(fileLocation);
      if (!exist) {
        throw new Error(`file not found ${file}`);
      }
      // res.download transfers the file at path as an “attachment”
      // http://expressjs.com/en/api.html#res.download
      res.download(fileLocation, file);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  public uploadFile = async (req: Request, res: Response) => {
    try {
      const { file } = req;
      if (!file) {
        res.status(400).send({ message: 'Please upload a file' });
      }
      res.send(file);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  public testDownloadFile = async (req: Request, res: Response) => {
    try {
      const headers = {
        authorization: `Bearer ${c.TOKEN_GUARD_KEY}`,
      };
      const result = await requestFile('https://localhost:8443/download/flying_whale_by_shu_le.jpg', 'flying_whale_by_shu_le.jpg', headers)
        .catch((error: any) => { throw new Error(error); });
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}
