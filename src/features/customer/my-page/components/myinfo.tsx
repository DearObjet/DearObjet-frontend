import { useState } from 'react';

import UploadFile from '../../../../assets/upload-file.svg';

const ToggleSwitch = ({ id, label }: { id: string; label: string }) => {
  const [isOn, setIsOn] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        id={id}
        onClick={() => setIsOn(!isOn)}
        className={`relative h-[1.5rem] w-[3rem] rounded-full transition-colors duration-200 ${
          isOn ? 'bg-black' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-[50%] h-[1.1rem] w-[1.1rem] translate-y-[-50%] rounded-full bg-white shadow transition-all duration-200 ${
            isOn ? 'left-[1.6rem]' : 'left-[0.2rem]'
          }`}
        />
      </button>
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

export const MyInfo = () => {
  return (
    <div className="w-[47.375rem] px-2">
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

        <label htmlFor="name">이름</label>
        <input
          id="name"
          type="text"
          className="h-[3rem] border-b border-black"
          placeholder="남현정"
        />

        <label htmlFor="phone">휴대폰번호</label>
        <input
          id="phone"
          className="h-[3rem] border-b border-black"
          type="text"
          placeholder="010-1234-5678"
        />

        <label htmlFor="email">이메일</label>
        <input
          id="email"
          type="email"
          className="h-[3rem] border-b border-black"
          placeholder="example@email.com"
        />

        <p>이벤트/혜택 소식 수신 여부</p>
        <div className="border-gray-3 flex flex-col gap-[0.875rem] rounded-xl border px-8 py-6">
          <ToggleSwitch id="kakao-talk" label="카카오톡 알림톡 수신동의" />
          <ToggleSwitch id="sms" label="SMS 수신동의" />
        </div>
      </form>
    </div>
  );
};
