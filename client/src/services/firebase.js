import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnewxR0Ify7IvaEYXHLpGU-XcLWEOly6E",
  authDomain: "hotdeal-17d47.firebaseapp.com",
  projectId: "hotdeal-17d47",
  storageBucket: "hotdeal-17d47.appspot.com",
  messagingSenderId: "930710537645",
  appId: "1:930710537645:web:a599c5275355e2c9610d24"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);