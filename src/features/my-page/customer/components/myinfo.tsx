import { useNavigate } from 'react-router';

import { useAppDispatch } from '../../../../app/hooks';

import { ROUTES } from '../../../../shared/constants';

import { useLogoutMutation, clearAuth } from '../../../../features/auth';

import { Button } from '../../../../shared/components/ui';
import UploadFile from '../../../../assets/upload-file.svg';

import { ToggleSwitch } from './ui/toggleswitch';
import { Input } from './ui/input';

export const MyInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // 서버 에러여도 클라이언트 상태는 초기화
    } finally {
      dispatch(clearAuth());
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="flex w-[41.625rem] flex-col gap-14">
      <form className="flex flex-col gap-[0.875rem]">
        <div className="relative inline-block">
          <img
            src=""
            alt=""
            className="h-[14.6975rem] w-[14.6975rem] justify-self-center rounded-full bg-[#d9d9d9] object-cover"
          />
          <button className="absolute bottom-0 right-[35%] flex h-[3.90875rem] w-[3.90875rem] items-center justify-center rounded-full bg-black">
            <img
              src={UploadFile}
              alt="업로드 파일"
              className="h-[2.18875rem] w-[2.18875rem]"
            />
          </button>
        </div>

        <Input id="name" label="이름" type="text" />
        <Input id="phone" label="휴대폰번호" type="text" />
        <Input id="email" label="이메일" type="email" />

        <p>이벤트/혜택 소식 수신 여부</p>
        <div className="border-gray-3 flex flex-col gap-[0.875rem] rounded-xl border px-8 py-6">
          <ToggleSwitch id="kakao-talk" label="카카오톡 알림톡 수신동의" />
          <ToggleSwitch id="sms" label="SMS 수신동의" />
        </div>
      </form>

      <div className="flex justify-between">
        <button className="text-gray-5 underline">회원탈퇴</button>
        <div className="flex gap-3">
          <Button
            variant="secondaryLight"
            label="로그아웃"
            className="h-10 py-0"
            onClick={handleLogout}
            type="button"
          />
          <Button
            variant="secondaryDark"
            label="저장"
            className="h-10 py-0"
            type="submit"
          />
        </div>
      </div>
    </div>
  );
};
