import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, fetchCurrentUser, updateUserProfile, logoutUser } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nexus_token'));
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const u = await fetchCurrentUser();
        setUser(u);
      } catch (err) {
        console.warn('Auth context load user warning:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const handleLogin = async (email, password) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    setShowAuthModal(false);
    return data;
  };

  const handleRegister = async (name, email, password) => {
    const data = await registerUser(name, email, password);
    setToken(data.token);
    setUser(data.user);
    setShowAuthModal(false);
    return data;
  };

  const handleLogout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
  };

  const handleUpdateProfile = async (updates) => {
    const updated = await updateUserProfile(updates);
    setUser(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        showAuthModal,
        setShowAuthModal,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateProfile: handleUpdateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
