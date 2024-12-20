// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCaYWw4FacOxdda0S92JPp9jT9F3pjsK7w",
  authDomain: "foodapp-a58b1.firebaseapp.com",
  projectId: "foodapp-a58b1",
  storageBucket: "foodapp-a58b1.firebasestorage.app",
  messagingSenderId: "938136213858",
  appId: "1:938136213858:web:d00936e90822dd825c743b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);