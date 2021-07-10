import React, { useContext, useState } from 'react';

import { getCookie } from '../../../util/Utils';
import AccountContext from './../../account/AccountContext';
import UpdateProfileImg from './UpdateProfileImg';
import {
  StyledProfileImg,
  ShowAddFormBtn,
  CloseAddFormBtn,
  ProfileImgContainer,
} from './StyledComponents';

const AccountDetails = () => {
  const { username, profileImage } = useContext(AccountContext);
  const [showAddImage, setShowAddImage] = useState(false);

  return (
    <>
      <ProfileImgContainer>
        {showAddImage ? (
          <>
            <CloseAddFormBtn onClick={() => setShowAddImage(false)} />
            <UpdateProfileImg close={() => setShowAddImage(false)} />
          </>
        ) : (
          <ShowAddFormBtn onClick={() => setShowAddImage(true)}>
            Change Profile image
          </ShowAddFormBtn>
        )}
        <StyledProfileImg
          src={profileImage || `${process.env.PUBLIC_URL}/images/webp/placeholder.webp`}
          alt=''
        />
      </ProfileImgContainer>
      <h1 style={{ fontSize: '2rem', textAlign: 'center' }} title='Username'>
        {username}
      </h1>
      <p style={{ textAlign: 'center' }} title='Email'>
        {getCookie('AioFeed_AccountEmail')}
      </p>
    </>
  );
};

export default AccountDetails;
