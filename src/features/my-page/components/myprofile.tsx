import { MyPageLayout } from './my-page-layout';
import { ProfileForm } from './profile-form';
import { ToggleSwitch } from '../../../shared/components/ui/toggleswitch';

export const MyInfo = () => {
  return (
    <MyPageLayout>
      <ProfileForm>
        <p className="mt-10">이벤트/혜택 소식 수신 여부</p>
        <div className="border-gray-3 flex flex-col gap-[0.875rem] rounded-xl border px-8 py-6">
          <ToggleSwitch id="kakao-talk" label="카카오톡 알림톡 수신동의" />
          <ToggleSwitch id="sms" label="SMS 수신동의" />
        </div>
      </ProfileForm>
    </MyPageLayout>
  );
};
