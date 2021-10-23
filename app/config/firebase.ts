import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('../../config.json');

// Set the configuration for your app
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || config.apiKey,
  authDomain: process.env.FIREBASE_DOMAIN || config.authDomain,
  // For databases not in the us-central1 location, databaseURL will be of the
  // form https://[databaseName].[region].firebasedatabase.app.
  // For example, https://your-database-123.europe-west1.firebasedatabase.app
  databaseURL: process.env.FIREBASE_DB_URL || config.databaseURL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || config.storageBucket
};

export const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);
