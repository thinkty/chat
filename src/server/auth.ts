import { Router } from 'express';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

export const authRouter = Router();

// Extract IdToken from the request and authenticate with Firebase
authRouter.post('/auth', (req, res) => {

  // Build Firebase credential with the Google ID token.
  const { idToken } = req.body;
  const credential = GoogleAuthProvider.credential(idToken);

  // Sign in with credential from the Google user.
  const auth = getAuth();
  signInWithCredential(auth, credential)
    .then((response) => {
      res.send({ user: response.user, idToken });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      // const credential = GoogleAuthProvider.credentialFromError(error);
      // ...

      console.log(errorCode, errorMessage, email);
    });
});
