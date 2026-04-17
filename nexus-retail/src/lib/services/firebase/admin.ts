import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  // Try to initialize using the credentials defined in environment variables.
  // In a Zero Trust architecture, use a strictly scoped service account.
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handling the newlines encoded in standard env vars
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase Admin Initialization Error', error);
  }
}

export const adminAuth = admin.apps.length > 0 ? admin.auth() : null;
