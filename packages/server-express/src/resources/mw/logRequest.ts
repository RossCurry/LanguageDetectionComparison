import { Request, Response, NextFunction } from 'express';

export default function logRequest (req: Request, _res: Response, next: NextFunction) {
  const { url, method, path } = req;
  console.info(`===> Express: ${method} ${path} ${url}`);
  next();
}
