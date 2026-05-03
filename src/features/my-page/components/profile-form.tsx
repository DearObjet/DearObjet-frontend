import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router';
import type { FormEvent, ChangeEvent, ReactNode } from 'react';

import { useAppDispatch } from '../../../app/hooks';

import { ROUTES } from '../../../shared/constants';
import { Button } from '../../../shared/components/ui';
import { ToggleSwitch } from '../../../shared/components/ui/toggleswitch';
import { useLogoutMutation, clearAuth } from '../../../features/auth';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from '../api/my-page-api';
import { useMyPagePhoneVerification } from '../hooks/use-phone-verification';

import { Input } from './ui/input';

import UploadFile from '../../../assets/upload-file.svg';
import DearObjectWhiteLogo from '../../../assets/dear-objet-white-logo.svg';

export interface ProfileFormRef {
  validate: () => boolean;
  getProfileImage: () => File | null;
}

interface ProfileFormProps {
  showSave?: boolean;
  isEditing?: boolean;
  children?: ReactNode;
}

export const ProfileForm = forwardRef<ProfileFormRef, ProfileFormProps>(
  ({ showSave = false, isEditing = true, children }, ref) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    const { data: profile } = useGetProfileQuery();
    const [updateProfile] = useUpdateProfileMutation();

    const {
      verificationCode,
      setVerificationCode,
      isCodeSent,
      isPhoneVerified,
      isCodeExpired,
      timeLeft,
      isSendDisabled,
      formatTime,
      resetVerification,
      handleSendVerification,
      handleVerifyCode,
    } = useMyPagePhoneVerification();

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [originalPhone, setOriginalPhone] = useState('');
    const [email, setEmail] = useState('');
    const [smsAgreement, setSmsAgreement] = useState(false);
    const [marketingAgreement, setMarketingAgreement] = useState(false);
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
      if (profile) {
        setName(profile.name);
        setPhone(profile.phoneNumber);
        setOriginalPhone(profile.phoneNumber);
        setEmail(profile.email);
        setSmsAgreement(profile.smsAgreement);
        setMarketingAgreement(profile.marketingAgreement);
        setProfileImagePreview(profile.profileUrl);
      }
    }, [profile]);

    const isPhoneChanged = phone !== originalPhone;

    const clearError = (key: string) =>
      setErrors((prev) => ({ ...prev, [key]: '' }));

    const formatPhoneNumber = (value: string) => {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 3) return digits;
      if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      if (raw.length <= 11) {
        setPhone(formatPhoneNumber(raw));
        resetVerification();
        clearError('phone');
        clearError('phoneVerified');
      }
    };

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setProfileImage(file);
      setProfileImagePreview(URL.createObjectURL(file));
    };

    const validateName = (value: string) => {
      if (!value) return '필수 입력 항목입니다.';
      if (!/^[가-힣]+$/.test(value)) return '한글만 가능합니다.';
      if (value.length < 2 || value.length > 17)
        return '이름은 최소 2자, 최대 17자까지 입력이 가능합니다.';
      return '';
    };

    const validateEmail = (value: string) => {
      if (!value) return '필수 입력 항목입니다.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return '올바른 이메일 형식이 아닙니다.';
      return '';
    };

    const validate = () => {
      const newErrors: Record<string, string> = {};

      const nameError = validateName(name);
      if (nameError) newErrors.name = nameError;

      const emailError = validateEmail(email);
      if (emailError) newErrors.email = emailError;

      if (!phone) newErrors.phone = '필수 입력 항목입니다.';

      if (isPhoneChanged) {
        if (isCodeSent && !isPhoneVerified) {
          newErrors.phoneVerified = '휴대폰 인증을 완료해주세요.';
        } else if (!isPhoneVerified) {
          newErrors.phoneVerified = '휴대폰 인증을 해주세요.';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    useImperativeHandle(ref, () => ({
      validate,
      getProfileImage: () => profileImage,
    }));

    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      try {
        await updateProfile({
          name,
          phoneNumber: phone.replace(/-/g, ''),
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
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt=""
                className="h-[12rem] w-[12rem] justify-self-center rounded-full object-cover"
              />
            ) : (
              <div className="flex h-[12rem] w-[12rem] items-center justify-center justify-self-center rounded-full bg-black">
                <img
                  src={DearObjectWhiteLogo}
                  alt="기본 프로필"
                  className="w-[70%] object-cover"
                />
              </div>
            )}
            {isEditing && (
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
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              id="name"
              label="이름"
              type="text"
              value={name}
              readOnly={!isEditing}
              onChange={(e) => {
                setName(e.target.value);
                clearError('name');
              }}
            />
            {errors.name && (
              <p className="text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              id="phone"
              label="휴대폰번호"
              type="text"
              value={phone}
              readOnly={!isEditing}
              onChange={handlePhoneChange}
              buttonLabel={isEditing ? '휴대폰 인증' : undefined}
              onButtonClick={() =>
                handleSendVerification(phone, (msg) =>
                  setErrors((prev) => ({ ...prev, phone: msg }))
                )
              }
              buttonDisabled={isSendDisabled}
            />
            {errors.phone && (
              <p className="text-sm text-red-400">{errors.phone}</p>
            )}

            {isPhoneChanged && isCodeSent && !isPhoneVerified && (
              <>
                <div
                  className={`flex w-full items-center rounded-md border px-3 py-2 ${
                    isCodeExpired || errors.verificationCode
                      ? 'border-red-400'
                      : 'border-gray-900'
                  }`}
                >
                  <input
                    placeholder="인증코드 6자리"
                    className="flex-1 text-sm outline-none placeholder:text-gray-400"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      clearError('verificationCode');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleVerifyCode(
                          phone,
                          () =>
                            setErrors((prev) => ({
                              ...prev,
                              phoneVerified: '',
                              verificationCode: '',
                            })),
                          (msg) =>
                            setErrors((prev) => ({
                              ...prev,
                              verificationCode: msg,
                            }))
                        );
                      }
                    }}
                    maxLength={6}
                    disabled={isCodeExpired}
                  />
                  <span className="mr-3 text-sm text-red-500">
                    {formatTime(timeLeft)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleVerifyCode(
                        phone,
                        () =>
                          setErrors((prev) => ({
                            ...prev,
                            phoneVerified: '',
                            verificationCode: '',
                          })),
                        (msg) =>
                          setErrors((prev) => ({
                            ...prev,
                            verificationCode: msg,
                          }))
                      )
                    }
                    disabled={!verificationCode || isCodeExpired}
                    className="text-sm text-black disabled:cursor-not-allowed disabled:text-gray-300"
                  >
                    확인
                  </button>
                </div>

                {isCodeExpired && (
                  <p className="text-sm text-red-400">
                    유효시간이 지났어요. &apos;휴대폰 인증&apos;을 다시
                    해주세요.
                  </p>
                )}
                {errors.verificationCode && !isCodeExpired && (
                  <p className="text-sm text-red-400">
                    {errors.verificationCode}
                  </p>
                )}
              </>
            )}

            {errors.phoneVerified && (
              <p className="text-sm text-red-400">{errors.phoneVerified}</p>
            )}

            {isPhoneChanged && isPhoneVerified && (
              <p className="text-sm text-blue-200">✓ 휴대폰 인증 완료</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Input
              id="email"
              label="이메일"
              type="email"
              value={email}
              readOnly={!isEditing}
              onChange={(e) => {
                setEmail(e.target.value);
                clearError('email');
              }}
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {children}

          <p className="mt-10">이벤트/혜택 소식 수신 여부</p>
          <div className="border-gray-3 flex flex-col gap-[0.875rem] rounded-xl border px-8 py-6">
            <ToggleSwitch
              id="kakao-talk"
              label="카카오톡 알림톡 수신동의"
              checked={smsAgreement}
              onChange={isEditing ? setSmsAgreement : () => {}}
            />
            <ToggleSwitch
              id="sms"
              label="SMS 수신동의"
              checked={marketingAgreement}
              onChange={isEditing ? setMarketingAgreement : () => {}}
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
  }
);

ProfileForm.displayName = 'ProfileForm';
