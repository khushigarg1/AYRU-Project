
import React, { createContext, useState, useContext, useEffect } from 'react'
import Cookies from 'js-cookie'
import Router, { useRouter } from 'next/router'

import api from '@/api';
import LoginForm from '../components/LoginForm';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openTab, setOpenTab] = useState("none")

  useEffect(() => {
    async function loadUserFromCookies() {
      const admintoken = Cookies.get('admintoken')
      if (admintoken) {
        try {
          api.defaults.headers.Authorization = `Bearer ${admintoken}`
          const { data: user } = await api.get('auth/admin/1')
          setUser(user)
        }
        catch (err) {
          setUser(null)
        }
      }
      setLoading(false)
    }

    loadUserFromCookies()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await api.post('auth/admin/login', { email, password });
      if (response && response.data && response.data.accessToken) {
        const admintoken = response.data.accessToken;
        Cookies.set('admintoken', admintoken, { expires: 60 });
        api.defaults.headers.Authorization = `Bearer ${admintoken}`;
        const { data: user } = await api.get(`auth/admin/${response?.data?.data?.id}`);
        setUser(user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  const logout = () => {
    Cookies.remove('admintoken')
    setUser(null)
    delete api.defaults.headers.Authorization
    // window.location.pathname = '/login'
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, loading, logout, openTab, setOpenTab }}>
      {children}
    </AuthContext.Provider>
  )
}

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading || (!isAuthenticated && window.location.pathname !== '/login')) {
    return <LoginForm />;
  }
  return children;
};
export const useAuth = () => useContext(AuthContext)