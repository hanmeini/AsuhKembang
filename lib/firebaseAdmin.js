import admin from "firebase-admin";

const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;
let cleanedKey = privateKeyRaw;

if (cleanedKey) {
  // Remove wrapping quotes if present
  if (cleanedKey.startsWith('"') && cleanedKey.endsWith('"')) {
    cleanedKey = cleanedKey.substring(1, cleanedKey.length - 1);
  }
  // Replace literal \n with real newlines
  cleanedKey = cleanedKey.replace(/\\n/g, "\n");
}

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: cleanedKey,
};

let db = null;

if (!admin.apps.length) {
  try {
    if (
      !serviceAccount.projectId ||
      !serviceAccount.clientEmail ||
      !serviceAccount.privateKey
    ) {
      throw new Error("Credential Firebase tidak lengkap di .env.local");
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    db = admin.firestore();
  } catch (error) {
    console.error("Firebase Initialization Error:", error);
  }
} else {
  db = admin.firestore();
}

export { admin, db };
export default admin;
