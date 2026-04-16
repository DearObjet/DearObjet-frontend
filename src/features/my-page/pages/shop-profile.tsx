import { useState } from 'react';

import { ProfileForm } from '../components/profile-form';
import { Input } from '../components/ui/input';

export const ShopProfile = () => {
  const [instagram, setInstagram] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');

  return (
    <ProfileForm>
      <Input
        id="business-phone"
        label="사업장 전화번호"
        type="text"
        value={businessPhone}
        onChange={(e) => setBusinessPhone(e.target.value)}
      />
      <Input
        id="instagram"
        label="Instagram Business Account ID"
        type="text"
        prefix="@"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />
    </ProfileForm>
  );
};
