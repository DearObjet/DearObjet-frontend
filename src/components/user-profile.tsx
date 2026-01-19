import React from 'react';

interface Props {
  className?: string;
}

const UserProfile: React.FC<Props> = ({ className }) => {
  return <div className={`text-white ${className || ''}`}>UserProfile</div>;
};

export default UserProfile;
