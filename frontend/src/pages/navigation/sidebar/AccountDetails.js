import React, { useContext } from 'react';

import AccountContext from './../../account/AccountContext';
import { StyledProfileImg, ProfileImgContainer } from './StyledComponents';

const AccountDetails = () => {
  const { user } = useContext(AccountContext);

  return (
    <>
      <ProfileImgContainer>
        <StyledProfileImg
          src={user?.profile_image || `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`}
          alt=''
        />
      </ProfileImgContainer>
      <h1 style={{ fontSize: '2rem', textAlign: 'center' }} title='Username'>
        {user.username}
      </h1>
      <p style={{ textAlign: 'center' }} title='Email'>
        {user.attributes.email}
      </p>
    </>
  );
};

export default AccountDetails;
