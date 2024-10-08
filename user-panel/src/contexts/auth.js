import React, { createContext, useState, useContext, useEffect, Suspense } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '../../api';
import LoginForm from '@/components/Authentication/LoginForm';
import SignUpForm from '@/components/Authentication/SignupForm';
import { decodeJWT } from 'aws-amplify/auth';
import { Box, CircularProgress } from '@mui/material';

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
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function loadUserFromCookies() {
      const token = Cookies.get('token');
      if (token) {
        try {
          setLoading(true);
          const tokenPayload = parseJwt(token);
          const userId = tokenPayload?.payload?.id;
          api.defaults.headers.Authorization = `Bearer ${token}`;
          const response = await api.get(`/auth/${userId}`);
          const [cartResponse, wishlistResponse] = await Promise.all([
            api.get(`/cart/user`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }),
            api.get(`/wishlist/user/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
          ]);
          const cartItemsData = cartResponse.data.data?.userCart;
          const wishlistItemsData = wishlistResponse.data.data;

          setCartCount(cartItemsData.length);
          setWishlistCount(wishlistItemsData.length);
          setUser(response.data?.data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setLoading(false);
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
      else {
        setLoading(false);
      }
    }
    loadUserFromCookies();
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    delete api.defaults.headers.Authorization;
    window.location.reload();
    router.push('/');
  };

  const openAuthModal = () => setAuthModalOpen(true);
  // const closeAuthModal = () => setAuthModalOpen(false);
  const closeAuthModal = () => {
    setAuthModalOpen(false);
    window.location.reload();
  };

  const switchToSignUp = () => setAuthStep('signup');
  const switchToLogin = () => setAuthStep('login');

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, setUser, loading, logout, setOpenTab, openAuthModal, closeAuthModal, setWishlistCount, wishlistCount, cartCount, setCartCount }}>
      <Suspense
        fallback={
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        {authModalOpen ? (
          authStep === 'login' ? <LoginForm switchToSignUp={switchToSignUp} /> : <SignUpForm switchToLogin={switchToLogin} />
        )
          : (children)}
      </Suspense>
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
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>);
  }

  return isAuthenticated ? children : <LoginForm />;
};

export const useAuth = () => useContext(AuthContext);
