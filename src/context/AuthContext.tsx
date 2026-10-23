import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, BOOTSTRAP_ADMIN_EMAIL, db } from '../firebase/config';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  saveUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Check admin status
  const evaluateAdminStatus = async (user: User | null): Promise<boolean> => {
    if (!user || !user.email) return false;
    const emailMatch = user.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
    if (emailMatch) return true;

    try {
      const adminDoc = await getDoc(doc(db, 'admins', user.uid));
      return adminDoc.exists();
    } catch {
      return false;
    }
  };

  const loadUserProfile = async (user: User) => {
    try {
      const userRef = doc(db, 'users', user.uid);
      const snap = await getDoc(userRef);
      const isUserAdmin = await evaluateAdminStatus(user);

      if (snap.exists()) {
        const data = snap.data() as UserProfile;
        setUserProfile({
          ...data,
          role: isUserAdmin ? 'admin' : data.role || 'customer',
        });
      } else {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Customer',
          role: isUserAdmin ? 'admin' : 'customer',
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, newProfile, { merge: true });
        setUserProfile(newProfile);
      }
    } catch (e) {
      console.warn('Could not load user profile document:', e);
      // Fallback in-memory profile
      setUserProfile({
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Customer',
        role: (await evaluateAdminStatus(user)) ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const adminCheck = await evaluateAdminStatus(user);
        setIsAdmin(adminCheck);
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      const isUserAdmin = res.user.email?.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: name,
        role: isUserAdmin ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (err) {
        console.warn('Failed to save profile on signup:', err);
      }
      setUserProfile(newProfile);
    }
  };

  const sendPasswordReset = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logoutUser = async () => {
    await signOut(auth);
    setUserProfile(null);
    setIsAdmin(false);
  };

  const saveUserProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser) return;
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
    setUserProfile(prev => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        isAdmin,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendPasswordReset,
        logoutUser,
        saveUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
