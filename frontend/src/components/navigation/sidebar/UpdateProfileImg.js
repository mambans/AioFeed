import axios from "axios";
import React, { useContext } from "react";

import AccountContext from "./../../account/AccountContext";
import useInput from "./../../useInput";
import { ProfileImgInput } from "./StyledComponent";

export default ({ close }) => {
  const { username, setProfileImage } = useContext(AccountContext);
  const { value: image, bind: bindimage, reset: resetimage } = useInput("");

  const addProfileImage = async () => {
    document.cookie = `Notifies_AccountProfileImg=${image}; path=/`;
    setProfileImage(image);
    await axios
      .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        token: image,
        tokenName: "ProfileImg",
      })
      .then(() => {
        close();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleSubmit = evt => {
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