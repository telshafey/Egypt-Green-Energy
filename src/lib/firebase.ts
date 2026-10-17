import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export Firestore with explicit database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(errInfo.error);
}

// Live Health & Diagnostics Test
export interface FirestoreHealthResult {
  success: boolean;
  latencyMs: number;
  databaseId: string;
  projectId: string;
  authEmail: string | null;
  isAuthenticated: boolean;
  error?: string;
}

export async function testFirestoreConnection(): Promise<FirestoreHealthResult> {
  const start = performance.now();
  const databaseId = firebaseConfig.firestoreDatabaseId;
  const projectId = firebaseConfig.projectId;
  const currentUser = auth.currentUser;

  try {
    // Attempt live read from server
    await getDocFromServer(doc(db, 'settings', 'general'));
    const latencyMs = Math.round(performance.now() - start);
    return {
      success: true,
      latencyMs,
      databaseId,
      projectId,
      authEmail: currentUser?.email || (currentUser?.isAnonymous ? 'مفتاح جلسة إدارة مشفر (Anonymous Admin)' : null),
      isAuthenticated: !!currentUser,
    };
  } catch (error) {
    const latencyMs = Math.round(performance.now() - start);
    const errorMsg = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      latencyMs,
      databaseId,
      projectId,
      authEmail: currentUser?.email || null,
      isAuthenticated: !!currentUser,
      error: errorMsg,
    };
  }
}

export async function ensureAdminSession(): Promise<any> {
  if (auth.currentUser) return auth.currentUser;
  try {
    const cred = await signInAnonymously(auth);
    return cred.user;
  } catch (err) {
    // Non-fatal if anonymous auth is disabled in the console
    return null;
  }
}

export { signInWithPopup, signInAnonymously, onAuthStateChanged, signOut };
