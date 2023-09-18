
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAxTKNkl3bmbtGJBgr4RejoYcSUrXq7Ikg",
  authDomain: "testapp-fcfc8.firebaseapp.com",
  projectId: "testapp-fcfc8",
  storageBucket: "testapp-fcfc8.appspot.com",
  messagingSenderId: "701139068545",
  appId: "1:701139068545:web:b5515d6a302c95e3088f80"
};


const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);