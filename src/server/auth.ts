import { randomUUID } from 'crypto';
import { Router } from 'express';
import { auth } from 'firebase-admin';

export const authRouter = Router();

/**
 * Generate token for the given uid
 */
authRouter.post('/token', async (req, res) => {

  // Missing/malformed request body
  const { uid } = req.body;
  if (!uid) {
    res.status(400).send('Missing/malformed uid');
    return;
  }

  auth()
    .createCustomToken(uid)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

/**
 * Check if a user exists with the given email and if the user does not exist,
 * create new user with given email and password.
 */
authRouter.post('/email', (req, res) => {

  // Missing/malformed request body
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send('Missing/malformed request');
    return;
  }

  auth()
    .getUserByEmail(email)
    .then(() => { res.sendStatus(200); })
    .catch(() => {
      auth().createUser({
        email,
        password,
        displayName: randomUUID(),
      })
      .then(() => { res.sendStatus(200); })
      .catch((error) => { res.status(500).send(error); })
    });
});
