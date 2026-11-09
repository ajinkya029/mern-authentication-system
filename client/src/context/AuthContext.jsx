import { createContext, useContext, useEffect, useState } from 'react';
import { apiRequest } from '../api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest('/auth/me')
      .then(data => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function signup(formData) {
    const data = await apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setUser(data.user);
    return data.user;
  }

  async function login(formData) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await apiRequest('/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
