import express from 'express';
import * as helmet from 'helmet';
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { authRouter } from './auth';
import { apiRouter } from './api';
import { AppOptions, cert, initializeApp, ServiceAccount } from 'firebase-admin/app';

dotenv.config();

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY,
}

const firebaseAdminConfig: AppOptions = {
  credential: cert(serviceAccount),
  databaseURL: `https://${process.env.FIREBASE_DB_NAME}.firebaseio.com`,
};

initializeApp(firebaseAdminConfig);

const app = express();

// Setting CSP to allow google sign-in scripts
// @see https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#content_security_policy
app.use(helmet.contentSecurityPolicy({
  directives: {
    scriptSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/client'],
    connectSrc: [
      `'self'`,
      'https://accounts.google.com/gsi/',
      'https://identitytoolkit.googleapis.com/v1/',
      'https://securetoken.googleapis.com/v1/token'
    ],
    frameSrc: [`'self'`, 'https://accounts.google.com/gsi/'],
    styleSrc: [`'self'`, `'unsafe-inline'`, 'https://accounts.google.com/gsi/style'],
    imgSrc: [`'self'`]
  }
}));

// Setting COOP to allow google sign-in popups
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin-allow-popups' })); // For google sign in popups
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));
app.use(express.static('public'));

app.use('/auth', authRouter);
app.use('/api', apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}`);
});
