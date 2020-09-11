// third party
import { NextFunction, Request, Response } from 'express';

// custom CORS middleware
export const allowCrossDomainMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // disable cors
  // https://enable-cors.org/server_expressjs.html
  // request must have protocol to ex http://localhost:3000/tags (OK), localhost:3000/tags (KO)
  res.header('Access-Control-Allow-Origin', '*');
  // required to prevent 'blocked by CORS policy: Method DELETE is not allowed by Access-Control-Allow-Methods in preflight response.'
  res.header('Access-Control-Allow-Methods', '*');
  // authorized headers, ex Authorization
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // required to prevent CORS error: Response to preflight request doesn't pass access control check: It does not have HTTP ok status
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
};
