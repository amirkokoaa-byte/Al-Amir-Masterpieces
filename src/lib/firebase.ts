import { initializeApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTaeyZFWUzK-WQZrw8MyfgTAtWxRfItsg",
  authDomain: "gen-lang-client-0229288687.firebaseapp.com",
  projectId: "gen-lang-client-0229288687",
  storageBucket: "gen-lang-client-0229288687.firebasestorage.app",
  messagingSenderId: "824667585520",
  appId: "1:824667585520:web:73d9d861dad8b168fcbb35",
  measurementId: "G-CNP142HYY1"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
      console.warn("Multiple tabs open, persistence can only be enabled in one tab at a a time.");
    } else if (err.code == 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable persistence");
    }
  });
} catch(e) {}
