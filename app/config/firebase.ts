import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

import { devConfig } from './devConfig';

// Set the configuration for your app
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || devConfig.apiKey,
  authDomain: process.env.FIREBASE_DOMAIN || devConfig.authDomain,
  // For databases not in the us-central1 location, databaseURL will be of the
  // form https://[databaseName].[region].firebasedatabase.app.
  // For example, https://your-database-123.europe-west1.firebasedatabase.app
  databaseURL: process.env.FIREBASE_DB_URL || devConfig.databaseURL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || devConfig.storageBucket
};

export const app = initializeApp(firebaseConfig);

// Get a reference to the database service
export const database = getDatabase(app);
