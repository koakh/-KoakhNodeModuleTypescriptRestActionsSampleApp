export enum LogService {
  HTTPS_SERVER = 'HTTPS_SERVER',
}

export interface AuditPayload {
  action: string;
  payload: any;
  result: any;
  error: any;
  // createdDate: Date;
}

export interface MongoDeletePayload {
  ok?: number;
  n?: number;
  deletedCount?: number;
}

export interface MongoUpdatePayload {
  ok?: number;
  n?: number;
  nModified?: number;
}
