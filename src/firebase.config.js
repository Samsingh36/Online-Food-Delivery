import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA-Fl_hYcjtGq0MZfx0iciVneSAxWzvUpo",
  authDomain: "restaurantapp-6fb0b.firebaseapp.com",
  databaseURL: "https://restaurantapp-6fb0b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "restaurantapp-6fb0b",
  storageBucket: "restaurantapp-6fb0b.appspot.com",
  messagingSenderId: "1019474981927",
  appId: "1:1019474981927:web:0b48495252f114dc2aca02"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
