import { ToggleSwitch } from '../../../../shared/components/ui/toggleswitch';

export const ShopSettingPage = () => {
  return (
    <div className="flex h-[20.5625rem] w-[42.5625rem] flex-col gap-4 rounded-2xl bg-white pb-[3.125rem] pl-[3.9375rem] pr-[5.3125rem] pt-[2.1875rem]">
      <h3 className="text-xl">알림 설정</h3>
      <div className="flex h-full w-full flex-col gap-[0.625rem] rounded-md bg-gray-200 px-[1.1875rem] pt-[1.625rem]">
        <ToggleSwitch id="" label="정산알림 on/off" />
        <ToggleSwitch id="" label="예약 취소 알림" />
        <ToggleSwitch id="" label="신규 입점신청 알림" />
        <ToggleSwitch id="" label="카카오톡 알림톡 수신동의" />
        <ToggleSwitch id="" label="E-mail 수신 동의" />
      </div>
    </div>
  );
};
