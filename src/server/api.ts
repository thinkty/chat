import { Router } from 'express';
import { auth } from 'firebase-admin';

export const apiRouter = Router();

// Middleware for authenticating user before accessing APIs
apiRouter.use('/', (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    const token = req.headers.authorization.split(' ')[1];
    auth()
      .verifyIdToken(token)
      .then(() => {
        console.log('Verified token')
        next();
      })
      .catch((error) => {
        console.error(error);
        res.status(401).send(error);
      })
  } else {
    res.status(401).send('Token missing');
  }
});

apiRouter.get('/', (_, res) => {
  res.status(200).send({data: 'OK'});
});