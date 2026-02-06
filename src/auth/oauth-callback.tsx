import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { useAppDispatch } from '../hooks/redux';
import { setSignupRequired } from '../store/slices/authSlice';
import { setAccessToken } from '../store/slices/authSlice';
import { useRefreshTokenMutation } from '../store/api/authApi';

export function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [refreshToken, { isLoading }] = useRefreshTokenMutation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      const signup = searchParams.get('signup');

      if (!signup) {
        navigate('/');
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
          navigate('/signup');
        } else if (signup === 'completed') {
          // 기존 회원 - 메인으로
          dispatch(setSignupRequired(false));
          navigate('/');
        }
      } catch (error) {
        console.error('Token refresh failed:', error);
        alert('로그인 처리 중 오류가 발생했습니다.');
        navigate('/');
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
}
