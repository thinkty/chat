import { Router } from 'express';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const authRouter = Router();

/**
 * Extract IdToken (obtained from the client-side with SignIn With Google) from the request and authenticate with Firebase
 * 
 * @see https://firebase.google.com/docs/auth/web/google-signin#expandable-2
 * @see https://firebase.google.com/docs/auth/web/google-signin#expandable-3
 */
authRouter.post('/auth', (req, res) => {

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
    .then((response) => {

      // Send user info along with idToken (JWT)
      res.send({
        user: response.user.displayName ? response.user.displayName : response.user.uid,
        idToken,
      });
    })
    .catch((error) => {

      // Handle Errors here.
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
