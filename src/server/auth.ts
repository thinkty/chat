import { Router } from 'express';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getUser } from './db';

export const authRouter = Router();

/**
 * Extract IdToken (obtained from the client-side with SignIn With Google) from the request and authenticate with Firebase
 * 
 * @see https://firebase.google.com/docs/auth/web/google-signin#expandable-2
 * @see https://firebase.google.com/docs/auth/web/google-signin#expandable-3
 */
authRouter.post('/auth-google', (req, res) => {

  // Missing/malformed idToken
  const idToken = req.body.idToken;
  if (typeof req.body.idToken === 'undefined' || idToken == null || idToken == '') {
    res.status(400); // Bad request
    res.send('Missing/malformed idToken');
    return;
  }

  // Build Firebase credential with the Google ID token.
  const credential = GoogleAuthProvider.credential(idToken);

  // Sign in with credential from the Google user.
  const auth = getAuth();
  signInWithCredential(auth, credential)
    .then(async (response) => {
      
      const name = response.user.displayName == null ? 'Anonymous' : response.user.displayName;
      const uid = response.user.uid;

      // Creact user in database if necessary and fetch conversation info
      const userRecord = await getUser(uid, name);

      // Send user info along with idToken (JWT)
      res.send({
        name,
        uid,
        idToken,
        userRecord,
      });
    })
    .catch((error) => {

      console.error(error);

      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      // const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      res.status(errorCode) // TODO: maybe 403 FORBIDDEN : invalid jwt (idToken). Check by manipulating the jwt
      res.send(errorMessage);
    });
});
