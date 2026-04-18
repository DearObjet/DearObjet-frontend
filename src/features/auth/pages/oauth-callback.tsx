import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useAppDispatch } from '../../../app/hooks';

import { ROUTES } from '../../../shared/constants';

import { setAccessToken, setSignupRequired } from '../slices/auth-slice';
import { useRefreshTokenMutation } from '../api/auth-api';

export const OAuthCallback = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const signup = searchParams.get('signup');

      if (!signup) {
        navigate(ROUTES.HOME);
        return;
      }

      try {
        // 백엔드에서 이미 쿠키에 refreshToken을 설정했으므로
        // 이 API 호출로 accessToken을 받아옴
        const result = await refreshToken().unwrap();
        dispatch(setAccessToken(result.accessToken));

        if (signup === 'required') {
          // 신규 회원 - 회원가입 페이지로
          dispatch(setSignupRequired(true));
          navigate(ROUTES.SIGNUP);
        } else if (signup === 'completed') {
          // 기존 회원 - 메인으로
          dispatch(setSignupRequired(false));
          navigate(ROUTES.HOME);
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate(ROUTES.HOME);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch, refreshToken]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-medium">로그인 처리 중...</div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary-bg border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return null;
};
