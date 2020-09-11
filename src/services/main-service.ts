import { Connection } from 'mongoose';
import { MainServer } from '../main-server';
import Audit, { IAudit } from '../models/mongoose/audit.model';
import { AuditPayload, MongoDeletePayload, MongoUpdatePayload } from '../types';

export class MainService {
  constructor(private readonly db: Connection, private readonly mainServer: MainServer) { }

  public checkIfIdValidAudit = async (fieldName: string, masterValue: string) => {
    // check if is a valid/exist masterId
    const document: IAudit = await Audit.findOne({ [fieldName]: masterValue }).catch((error) => { throw error; });
    if (!document) {
      throw new Error(`Invalid ${Audit.name} document with ${fieldName} and value ${masterValue}`);
    }
  }

  public createAudit = (payload: AuditPayload): Promise<IAudit> => new Promise(async (resolve, reject) => {
    try {
      const audit = new Audit(payload);
      const document = await audit.save().catch((error) => { throw error; });
      resolve(document);
    } catch (error) {
      reject(error);
    }
  })

  public getAuditAll = (): Promise<IAudit[]> => new Promise(async (resolve, reject) => {
    try {
      const documents: IAudit[] = await Audit.find().sort({ name: 'ascending' });
      resolve(documents);
    } catch (error) {
      reject(error);
    }
  })

  public getAudit = (auditId: string): Promise<IAudit> => new Promise(async (resolve, reject) => {
    try {
      // check if is a valid/exist masterDocument
      await this.checkIfIdValidAudit('_id', auditId);
      const document: IAudit = await Audit.findOne({ _id: auditId });
      resolve(document);
    } catch (error) {
      reject(error);
    }
  })

  public updateAudit = (auditId: string, payload: AuditPayload): Promise<MongoUpdatePayload> => new Promise(async (resolve, reject) => {
    try {
      // check if is a valid/exist masterDocument
      await this.checkIfIdValidAudit('_id', auditId);
      const result: MongoUpdatePayload = await Audit.update({ _id: auditId }, payload as any);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  })

  public removeAudit = (auditId: string): Promise<MongoDeletePayload> => new Promise(async (resolve, reject) => {
    try {
      // check if is a valid/exist masterDocument
      await this.checkIfIdValidAudit('_id', auditId);
      const result: MongoDeletePayload = await Audit.deleteOne({ _id: auditId });
      resolve(result);
    } catch (error) {
      reject(error);
    }
  })
}
