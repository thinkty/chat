import express from 'express';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import { randomBytes } from 'crypto';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { authRouter } from './auth';

dotenv.config();

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
};
initializeApp(firebaseConfig);

const app = express();

// Middleware for setting nonce on each request. !! NONCE IS NOT IMPLEMENTED !!
// @see https://github.com/helmetjs/helmet#reference
// TODO: add logging
app.use((_, res, next) => {
  res.locals.nonce = randomBytes(16).toString('hex');
  next();
});

// Setting CSP to allow google sign-in scripts
// @see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy
// For adding nonce in the script-src, casting the http Response type to an Express Response type shows locals
// @see https://stackoverflow.com/a/71721914/12448426
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/client'],
    // scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/client', (req, res) => `'nonce-${(res as express.Response).locals.nonce}'`],
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

// app.get('*bundle.js', (req, res) => {
//   res.sendFile('bundle.js', { root: path.join(__dirname, '../../public') });
// });
// app.get('*bundle.js.map', (req, res) => {
//   res.sendFile('bundle.map.js', { root: path.join(__dirname, '../../public') });
// });

// // Setting a wildcard due to react-router paths
// app.get('*', (req, res) => {
//   res.sendFile('index.html', { root: path.join(__dirname, '../../public') });
// });

// TODO: check jwt (or idToken for Google) before doing any operation
app.get('/api', (req, res) => {
  res.send('hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}`);
});
