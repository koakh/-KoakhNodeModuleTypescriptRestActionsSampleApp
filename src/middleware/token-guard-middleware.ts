import { NextFunction, Request, Response } from 'express';
import c from '../config/constants';

const unauthorizedMessage: string = 'Unauthorized! Please supply a valid authorization token or apiKey query parameter';

/**
 * custom express authentication middleware
 */
export const expressTokenGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const queryApiKey = (req.query.apiKey) ? req.query.apiKey : null;
  if (req.path.startsWith(c.CSS_PATH) || req.path.startsWith(c.JS_PATH) ||
    (queryApiKey === c.TOKEN_GUARD_KEY && (
      req.path.startsWith(c.DOC_PATH) || req.path.startsWith(c.AUDIT_PATH)
    ))
  ) {
    next();
  } else {
    const authorization: string = (req.headers.authorization)
      // console.log(`Header Authorization: ${authorization}`);
      // console.log(`Request from: ${req.originalUrl}`);
      // console.log(`Request type: ${req.method}`);
      ? (req.headers.authorization).replace('Bearer ', '')
      : null;
    if (authorization !== c.TOKEN_GUARD_KEY) {
      res.status(401).send({ error: unauthorizedMessage });
    } else {
      next();
    }
  }
};
