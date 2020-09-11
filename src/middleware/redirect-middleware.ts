// third party
import { NextFunction, Request, Response } from 'express';

const HTTPS_SERVER_PORT = process.env.HTTPS_SERVER_PORT || 8443;

// custom redirect middleware
export const redirectMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (!/https/.test(req.protocol)) {
    const redirectUrl = `https://${req.hostname}:${HTTPS_SERVER_PORT}${req.originalUrl}`;
    // console.log(`redirect to : [${redirectUrl}]`);
    res.redirect(redirectUrl);
  } else {
    return next();
  }
};
