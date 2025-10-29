import { useEffect } from 'react';
import { useAppDispatch } from './redux';
import { setCredentials, logout, setLoading } from '../store/slices/auth-slice';
import { useLazyVerifyTokenQuery } from '../utils/auth-api';

export const useAuthInit = () => {
  const dispatch = useAppDispatch();
  const [verifyToken] = useLazyVerifyTokenQuery();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        dispatch(setLoading(false));
        return;
      }

      try {
        const result = await verifyToken(token).unwrap();
        dispatch(setCredentials({ user: result.user, token }));
      } catch (error) {
        console.error('Token verification error:', error);
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch, verifyToken]);
};
