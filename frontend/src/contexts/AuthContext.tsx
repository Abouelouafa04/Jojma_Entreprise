import React, { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  fullName: string;
  accountType: 'creator' | 'company' | 'studio' | 'agency';
  role: 'user' | 'admin';
  phone?: string | null;
  location?: string | null;
  company?: string | null;
  industry?: string | null;
  jobTitle?: string | null;
  profilePhotoUrl?: string | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      // Check for token in localStorage (for UI state)
      const storedToken = localStorage.getItem('jojma_token');
      const storedUser = localStorage.getItem('jojma_user');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (error) {
          // Invalid stored data, clear it
          localStorage.removeItem('jojma_token');
          localStorage.removeItem('jojma_user');
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback((newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('jojma_token', newToken);
    localStorage.setItem('jojma_user', JSON.stringify(newUser));
  }, []);

  const updateUser = useCallback((patch: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem('jojma_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(async () => {
    try {
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.warn('Logout API call failed:', error);
    }

    // Clear local state and storage
    setToken(null);
    setUser(null);
    localStorage.removeItem('jojma_token');
    localStorage.removeItem('jojma_user');

    // Clear any cookies (though they should be httpOnly)
    document.cookie = 'jojma_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }, [token]);

  const isAuthenticated = !!token;

  const value = useMemo(
    () => ({ user, token, login, logout, updateUser, isAuthenticated, isLoading }),
    [user, token, login, logout, updateUser, isAuthenticated, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
