import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFg_LqC2ZsX9pHbXNCplNntD8j92JmiMc",
  authDomain: "healthier-4bf0a.firebaseapp.com",
  projectId: "healthier-4bf0a",
  storageBucket: "healthier-4bf0a.firebasestorage.app",
  messagingSenderId: "436173241431",
  appId: "1:436173241431:web:cd82db826f8a700e323712"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };