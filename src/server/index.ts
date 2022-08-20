import express from 'express';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { authRouter } from './auth';

dotenv.config();

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
};
initializeApp(firebaseConfig);

const app = express();

// Setting CSP to allow google sign-in scripts
// @see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/client'],
    connectSrc: [`'self'`, 'https://accounts.google.com/gsi/'],
    frameSrc: [`'self'`, 'https://accounts.google.com/gsi/'],
    styleSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/style'],
    imgSrc: [`'self'`]
  }
}));

// Setting COOP to allow google sign-in popups
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin-allow-popups' })); // For google sign in popups
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));
app.use(authRouter);
app.use(express.static('public'));

// TODO: check jwt before doing any operation
app.get('/api', (_, res) => {
  res.send('hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}`);
});
