import express from 'express';
import { FirebaseOptions, initializeApp } from 'firebase/app';
import * as helmet from "helmet";
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
import { authRouter } from './auth';

dotenv.config();

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};
initializeApp(firebaseConfig);

const app = express();
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin-allow-popups' })); // For google sign in popups
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));
app.use('/api', authRouter);
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


app.get('/api', (req, res) => {
  res.send('hello world');
});

app.listen(process.env.PORT, () => {
  console.log(`Application started on port ${process.env.PORT}`);
});
