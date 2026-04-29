import React from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { ChangeEvent } from 'react';

import { useAppDispatch } from '../../../app/hooks';

import { ROUTES } from '../../../shared/constants';
import { Button } from '../../../shared/components/ui';
import { ToggleSwitch } from '../../../shared/components/ui/toggleswitch';
import { useLogoutMutation, clearAuth } from '../../../features/auth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../api/my-page-api';

import { Input } from './ui/input';

import UploadFile from '../../../assets/upload-file.svg';

interface ProfileFormProps {
  showSave?: boolean;
}

export const ProfileForm = ({ showSave = false }: ProfileFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const { data: profile } = useGetProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [smsAgreement, setSmsAgreement] = useState(false);
  const [marketingAgreement, setMarketingAgreement] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState('');

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setPhone(profile.phoneNumber);
      setEmail(profile.email);
      setSmsAgreement(profile.smsAgreement);
      setMarketingAgreement(profile.marketingAgreement);
      setProfileImagePreview(profile.profileImageUrl);
    }
  }, [profile]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile({
        name,
        phoneNumber: phone,
        smsAgreement,
        marketingAgreement,
        ...(profileImage && { profileImage }),
      }).unwrap();
      alert('저장되었습니다.');
    } catch {
      alert('저장에 실패했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearAuth());
      navigate(ROUTES.HOME);
    }
  };

  return (
    <div className="flex w-[34rem] flex-col gap-14">
      <form
        id="profile-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-[0.875rem]"
      >
        <div className="relative mb-[5.125rem] inline-block">
          <img
            src={profileImagePreview}
            alt=""
            className="h-[12rem] w-[12rem] justify-self-center rounded-full bg-[#d9d9d9] object-cover"
          />
          <label className="absolute bottom-0 right-[30%] flex h-[3.90875rem] w-[3.90875rem] cursor-pointer items-center justify-center rounded-full bg-black">
            <img
              src={UploadFile}
              alt="업로드 파일"
              className="h-[2.18875rem] w-[2.18875rem]"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <Input
          id="name"
          label="이름"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="phone"
          label="휴대폰번호"
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          buttonLabel="휴대폰 인증"
          onButtonClick={() => {}}
        />
        <Input id="email" label="이메일" type="email" value={email} readOnly />

        <p className="mt-10">이벤트/혜택 소식 수신 여부</p>
        <div className="border-gray-3 flex flex-col gap-[0.875rem] rounded-xl border px-8 py-6">
          <ToggleSwitch
            id="kakao-talk"
            label="카카오톡 알림톡 수신동의"
            checked={smsAgreement}
            onChange={setSmsAgreement}
          />
          <ToggleSwitch
            id="sms"
            label="SMS 수신동의"
            checked={marketingAgreement}
            onChange={setMarketingAgreement}
          />
        </div>
      </form>

      <div className="flex justify-between">
        <button className="text-gray-5 underline">회원탈퇴</button>
        <div className="flex gap-3">
          <Button
            variant="secondaryLight"
            label="로그아웃"
            style={{ height: '2.5rem', paddingTop: 0, paddingBottom: 0 }}
            onClick={handleLogout}
            type="button"
          />
          {showSave && (
            <Button
              form="profile-form"
              variant="secondaryDark"
              label="저장"
              style={{ height: '2.5rem', paddingTop: 0, paddingBottom: 0 }}
              type="submit"
            />
          )}
        </div>
      </div>
    </div>
  );
};
