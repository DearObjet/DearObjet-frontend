import { MyPageLayout } from './my-page-layout';
import { ProfileForm } from './profile-form';

export const MyProfile = () => {
  return (
    <MyPageLayout>
      <ProfileForm showSave />
    </MyPageLayout>
  );
};
