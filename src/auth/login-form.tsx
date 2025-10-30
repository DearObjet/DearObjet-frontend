import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch } from '../hooks/redux';
import { useLoginMutation } from '../utils/auth-api';
import { setCredentials } from '../store/slices/auth-slice';
import { getErrorMessage } from '../utils/error-handler';
import { Input } from '../components/ui/input';

interface LabelProps {
  id: string;
  label: string;
}

interface ErrorMessageProps {
  error: string;
}

interface FormData {
  id: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState<FormData>({
    id: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError('');

    try {
      const response = await login(formData).unwrap();
      dispatch(setCredentials(response));
      navigate('/');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, '로그인에 실패했습니다');
      setError(errorMessage);
    }
  };

  const Label: React.FC<LabelProps> = ({ id, label }) => (
    <label className="text-[0.625rem] font-normal" htmlFor={id}>
      {label}
    </label>
  );

  const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => (
    <div className="text-sm text-red-600" role="alert">
      {error}
    </div>
  );

  return (
    <div className="">
      <h2 className="">로그인폼</h2>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1">
          <Label id="id" label="아이디" />
          <Input
            id="id"
            type="text"
            value={formData.id}
            placeholder="아이디를 입력해주세요"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label id="password" label="비밀번호" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            placeholder="비밀번호를 입력해주세요"
            onChange={handleChange}
            className="w-full"
          />
        </div>
        {error && <ErrorMessage error={error} />}
        <div>
          <Link to="/">ID/PW 찾기</Link>
          <Link to="/">회원가입</Link>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className=""
          aria-busy={isLoading}
        >
          {isLoading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
