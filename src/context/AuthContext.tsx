import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface UserWorkspace {
  sessionId: string;
  name: string;
  avatar: string;
  bookmarks: string[];
  downloadedComponents: string[];
  createdAt: string;
  lastActiveAt?: string;
}

interface AuthContextType {
  sessionId: string;
  workspace: UserWorkspace;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    downloadedComponents: string[];
  };
  isAuthenticated: boolean;
  loading: boolean;
  cloudSynced: boolean;
  bookmarkedIds: string[];
  downloadedComponents: string[];
  toggleBookmark: (apiId: string) => Promise<void>;
  isBookmarked: (apiId: string) => boolean;
  recordDownload: (componentName: string) => Promise<void>;
  clearAllBookmarks: () => Promise<void>;
  // Legacy aliases so no component breaks
  login: () => Promise<{ success: boolean }>;
  signup: () => Promise<{ success: boolean }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<{ success: boolean }>;
  loginAsGuest: () => Promise<{ success: boolean }>;
  resetPassword: () => Promise<{ success: boolean }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getOrCreateSessionId(): string {
  try {
    let id = localStorage.getItem('apiverse_client_session_id');
    if (!id || id.length < 5) {
      id = 'usr_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      localStorage.setItem('apiverse_client_session_id', id);
    }
    return id;
  } catch {
    return 'usr_' + Math.random().toString(36).substring(2, 9);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionId] = useState<string>(() => getOrCreateSessionId());
  
  // Default sample favorites for a fresh user
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apiverse_bookmarks');
      return saved ? JSON.parse(saved) : ['opentdb', 'pokeapi', 'open-meteo', 'postal-pincode'];
    } catch {
      return ['opentdb', 'pokeapi', 'open-meteo', 'postal-pincode'];
    }
  });

  const [downloadedComponents, setDownloadedComponents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('apiverse_downloads');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cloudSynced, setCloudSynced] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Sync with Firestore per unique user session ID
  useEffect(() => {
    let isMounted = true;

    const syncWorkspaceWithFirestore = async () => {
      try {
        const workspaceDocRef = doc(db, 'workspaces', sessionId);
        const snap = await getDoc(workspaceDocRef);

        if (snap.exists()) {
          const data = snap.data();
          if (isMounted) {
            if (Array.isArray(data.bookmarks)) {
              setBookmarkedIds(data.bookmarks);
              localStorage.setItem('apiverse_bookmarks', JSON.stringify(data.bookmarks));
            }
            if (Array.isArray(data.downloads)) {
              setDownloadedComponents(data.downloads);
              localStorage.setItem('apiverse_downloads', JSON.stringify(data.downloads));
            }
            setCloudSynced(true);
          }
        } else {
          // Initialize new client workspace document in Firestore
          const initialData = {
            sessionId,
            bookmarks: bookmarkedIds,
            downloads: downloadedComponents,
            createdAt: new Date().toISOString(),
            lastActiveAt: new Date().toISOString()
          };
          await setDoc(workspaceDocRef, initialData, { merge: true });
          if (isMounted) setCloudSynced(true);
        }
      } catch (err) {
        console.warn('Firestore workspace sync notice:', err);
        // App works seamlessly even if offline
        if (isMounted) setCloudSynced(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    syncWorkspaceWithFirestore();

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  const toggleBookmark = async (apiId: string) => {
    const isCurrentlySaved = bookmarkedIds.includes(apiId);
    const updated = isCurrentlySaved
      ? bookmarkedIds.filter((id) => id !== apiId)
      : [...bookmarkedIds, apiId];

    setBookmarkedIds(updated);
    try {
      localStorage.setItem('apiverse_bookmarks', JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Persist to user's isolated Firestore workspace
    try {
      const workspaceDocRef = doc(db, 'workspaces', sessionId);
      await updateDoc(workspaceDocRef, {
        bookmarks: updated,
        lastActiveAt: new Date().toISOString()
      });
      setCloudSynced(true);
    } catch (err) {
      console.warn('Could not sync bookmark to Firestore:', err);
    }
  };

  const isBookmarked = (apiId: string) => bookmarkedIds.includes(apiId);

  const recordDownload = async (componentName: string) => {
    if (!downloadedComponents.includes(componentName)) {
      const updated = [...downloadedComponents, componentName];
      setDownloadedComponents(updated);
      try {
        localStorage.setItem('apiverse_downloads', JSON.stringify(updated));
      } catch {
        // ignore
      }

      // Persist to user's isolated Firestore workspace
      try {
        const workspaceDocRef = doc(db, 'workspaces', sessionId);
        await updateDoc(workspaceDocRef, {
          downloads: updated,
          lastActiveAt: new Date().toISOString()
        });
        setCloudSynced(true);
      } catch (err) {
        console.warn('Could not sync download to Firestore:', err);
      }
    }
  };

  const clearAllBookmarks = async () => {
    setBookmarkedIds([]);
    try {
      localStorage.setItem('apiverse_bookmarks', JSON.stringify([]));
      const workspaceDocRef = doc(db, 'workspaces', sessionId);
      await updateDoc(workspaceDocRef, {
        bookmarks: [],
        lastActiveAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Error clearing bookmarks:', err);
    }
  };

  const workspace: UserWorkspace = {
    sessionId,
    name: `User #${sessionId.slice(-5)}`,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${sessionId}`,
    bookmarks: bookmarkedIds,
    downloadedComponents,
    createdAt: new Date().toISOString()
  };

  const user = {
    id: sessionId,
    name: `Developer Workspace`,
    email: `${sessionId}@workspace.db`,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${sessionId}`,
    role: 'Pro Developer (Unlocked)',
    downloadedComponents
  };

  return (
    <AuthContext.Provider
      value={{
        sessionId,
        workspace,
        user,
        isAuthenticated: true, // Registration completely removed, everyone is unlocked
        loading,
        cloudSynced,
        bookmarkedIds,
        downloadedComponents,
        toggleBookmark,
        isBookmarked,
        recordDownload,
        clearAllBookmarks,
        // Legacy no-op handlers
        login: async () => ({ success: true }),
        signup: async () => ({ success: true }),
        logout: async () => {},
        loginWithGoogle: async () => ({ success: true }),
        loginAsGuest: async () => ({ success: true }),
        resetPassword: async () => ({ success: true })
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
