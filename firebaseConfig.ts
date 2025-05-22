import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBEDW0Q_1GCPks5BhlHvMannUolni1BRZg",
  authDomain: "carappmanager.firebaseapp.com",
  projectId: "carappmanager",
  storageBucket: "carappmanager.firebasestorage.app",
  messagingSenderId: "674929252461",
  appId: "1:674929252461:web:8508486de07188610a0764",
  measurementId: "G-KVTDW262EV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);