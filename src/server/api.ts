import { Router } from 'express';

export const apiRouter = Router();

apiRouter.get('/', (req, res) => {
  res.status(200).send('OK');
});