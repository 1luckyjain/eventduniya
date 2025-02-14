// src/pages/Logout.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth-context';

const Logout: React.FC = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    axios
      .post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        logout();
        navigate('/', { replace: true });
      })
      .catch((error) => {
        console.error('Logout error:', error);
        // Even if logout API fails, clear the auth state and redirect
        logout();
        navigate('/', { replace: true });
      });
  }, [logout, navigate, token, API_URL]);

  return null; // Nothing is rendered
};

export default Logout;
