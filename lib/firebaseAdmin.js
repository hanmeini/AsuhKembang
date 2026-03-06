import admin from "firebase-admin";

console.log("PROJECT:", process.env.FIREBASE_PROJECT_ID);
console.log("EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("KEY EXISTS:", !!process.env.FIREBASE_PRIVATE_KEY);

const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
const cleanedKey = privateKeyRaw
  ?.replace(/^"(.*)"$/, "$1")
  .replace(/\\n/g, "\n");

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: cleanedKey,
};

let db = null;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin Initialized successfully");
    db = admin.firestore();
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  db = admin.firestore();
}

export { admin, db };
export default admin;
