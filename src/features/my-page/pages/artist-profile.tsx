import { useState } from 'react';

import { ProfileForm } from '../components/profile-form';
import { Input } from '../components/ui/input';

export const ArtistProfile = () => {
  const [instagram, setInstagram] = useState('');

  return (
    <ProfileForm>
      <Input
        id="instagram"
        label="Instagram Business Account ID"
        type="text"
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
      />
    </ProfileForm>
  );
};
