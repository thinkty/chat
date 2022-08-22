import { Router, Request } from 'express';
import { auth } from 'firebase-admin';
import { getUser } from './db';

export const apiRouter = Router();

/**
 * Middleware for authenticating user before accessing APIs
 */
apiRouter.use('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    auth()
      .verifyIdToken(token)
      .then(() => {
        next();
      })
      .catch((error) => {
        res.status(401).send(error);
      })
  } else {
    res.status(401).send('Token missing');
  }
});

/**
 * Basic health check
 */
apiRouter.get('/', (_, res) => {
  res.status(200).send({ data: 'OK' });
});

/**
 * Retrieve DBUserRecord from the realtime database. If the user does not exist,
 * create an empty DBUserRecord into the realtime database and return it.
 */
apiRouter.get('/user', (req: Request<{}, {}, {}, { uid: string, name: string }>, res) => {

  // Missing/malformed request body
  const { uid, name } = req.query;
  if (!uid || !name) {
    res.status(400).send('Missing/malformed request');
    return;
  }

  getUser(uid, name)
    .then((record) => {
      res.send({ record });
    })
    .catch((error) => {
      res.status(400).send(error);
    });
});