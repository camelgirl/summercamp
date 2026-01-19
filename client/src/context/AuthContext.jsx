import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('summercamp_user');
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = async (email, password, name) => {
    try {
      // For now, we'll use localStorage. In production, this would call an API
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('summercamp_users') || '[]');
      if (existingUsers.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      // Create new user (in production, password would be hashed on the server)
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };

      // Store user
      existingUsers.push({
        ...newUser,
        password, // In production, never store plain passwords!
      });
      localStorage.setItem('summercamp_users', JSON.stringify(existingUsers));
      localStorage.setItem('summercamp_user', JSON.stringify(newUser));

      setUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      // For now, we'll use localStorage. In production, this would call an API
      const users = JSON.parse(localStorage.getItem('summercamp_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      };

      localStorage.setItem('summercamp_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (googleUserData) => {
    try {
      // Store user data from Google
      const userData = {
        id: googleUserData.id,
        email: googleUserData.email,
        name: googleUserData.name,
        picture: googleUserData.picture,
        provider: 'google',
        emailVerified: googleUserData.emailVerified,
        createdAt: new Date().toISOString(),
      };

      // Store in localStorage
      localStorage.setItem('summercamp_user', JSON.stringify(userData));
      
      // Also store in users list for compatibility
      const existingUsers = JSON.parse(localStorage.getItem('summercamp_users') || '[]');
      const existingUserIndex = existingUsers.findIndex(u => u.email === googleUserData.email);
      
      if (existingUserIndex >= 0) {
        existingUsers[existingUserIndex] = { ...existingUsers[existingUserIndex], ...userData };
      } else {
        existingUsers.push(userData);
      }
      localStorage.setItem('summercamp_users', JSON.stringify(existingUsers));

      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Sign out from Google if using Google
    if (window.google && user?.provider === 'google') {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (error) {
        console.error('Error signing out from Google:', error);
      }
    }
    localStorage.removeItem('summercamp_user');
    setUser(null);
  };

  const value = {
    user,
    signup,
    login,
    loginWithGoogle,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
