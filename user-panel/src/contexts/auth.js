import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '../../api';
import LoginForm from '@/components/Authentication/LoginForm';
import SignUpForm from '@/components/Authentication/SignupForm';
import { decodeJWT } from 'aws-amplify/auth';

const AuthContext = createContext({});

// Define parseJwt function
const parseJwt = (token) => {
  try {
    return decodeJWT(token);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState('login');
  const router = useRouter();
  const [openTab, setOpenTab] = useState("none");
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        try {
          const tokenPayload = parseJwt(token);
          const userId = tokenPayload?.payload?.id;
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get(`/auth/${userId}`);
          setUser(response.data?.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null);
        }
      }
      setLoading(false);
    }
    console.log("hyy");
    loadUserFromCookies();
  }, []); // Only run once on component mount

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    delete api.defaults.headers.Authorization;
    router.push('/login');
  };

  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  const switchToSignUp = () => setAuthStep('signup');
  const switchToLogin = () => setAuthStep('login');
  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, setUser, loading, logout, setOpenTab, openAuthModal, closeAuthModal, setWishlistCount, wishlistCount }}>
      {authModalOpen ? (
        authStep === 'login' ? <LoginForm switchToSignUp={switchToSignUp} /> : <SignUpForm switchToLogin={switchToLogin} />
      )
        : (children)}
    </AuthContext.Provider>
  );
};

export const ProtectRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return isAuthenticated ? children : <LoginForm />;
};

export const useAuth = () => useContext(AuthContext);
