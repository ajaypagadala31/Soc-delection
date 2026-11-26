import express from 'express';

export const errorHandler = (
  err: any,
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
};

export const notFound = (_req: express.Request, res: express.Response) => {
  res.status(404).json({ error: 'Not Found' });
};

export const catchAsync = (fn: Function) => {
  return (_req: express.Request, res: express.Response, next: express.NextFunction) => {
    Promise.resolve(fn(_req, res, next)).catch(next);
  };
};

export default errorHandler;