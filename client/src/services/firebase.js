import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAau_TDqi_TZKO506jEyq_c58u_BJ93mcU',
  authDomain: 'sonix-a4ed2.firebaseapp.com',
  projectId: 'sonix-a4ed2',
  storageBucket: 'sonix-a4ed2.appspot.com',
  messagingSenderId: '892515466584',
  appId: '1:892515466584:web:f1ed1dcdbad6ed7419392d',
  measurementId: 'G-621445Q4SH'
};

const firebase = initializeApp(firebaseConfig);
const storage = getStorage(firebase);

export { storage };