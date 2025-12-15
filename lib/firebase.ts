// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeetSRXurf63IuEDkhuhiBW9f0A2WpJHA",
  authDomain: "mia-beauty-project.firebaseapp.com",
  projectId: "mia-beauty-project",
  storageBucket: "mia-beauty-project.firebasestorage.app",
  messagingSenderId: "587812939640",
  appId: "1:587812939640:web:2188cb920878f0654f4a8d",
  measurementId: "G-JVC5QW0N2W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();