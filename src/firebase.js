// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBMWfJaqJ_CDE7n-qcuRYLGbYSybVus9Us",
  authDomain: "stock-prediction-7a7ba.firebaseapp.com",
  projectId: "stock-prediction-7a7ba",
  storageBucket: "stock-prediction-7a7ba.firebasestorage.app",
  messagingSenderId: "1095353627456",
  appId: "1:1095353627456:web:4fd0b13eceaeaa0fbec0a5",
  measurementId: "G-HDVTXZ6BS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);