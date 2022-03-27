import React, { useContext } from 'react';

import AccountContext from './../../account/AccountContext';
import useInput from './../../../hooks/useInput';
import { ProfileImgInput } from './StyledComponents';
import API from '../API';

const UpdateProfileImg = ({ close }) => {
  const { setProfileImage } = useContext(AccountContext);
  const { value: image, bind: bindimage, reset: resetimage } = useInput('');

  const addProfileImage = async () => {
    setProfileImage(image);

    await API.changeProfileImage(image).then(close);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    addProfileImage();
    resetimage();
  };

  return (
    <>
      <ProfileImgInput onSubmit={handleSubmit}>
        <label>
          Image Url:
          <input type='text' placeholder='https://...' {...bindimage} />
        </label>
        <input type='submit' value='Update' />
      </ProfileImgInput>
    </>
  );
};

export default UpdateProfileImg;
