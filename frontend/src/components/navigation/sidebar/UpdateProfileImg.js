import axios from "axios";
import React, { useContext } from "react";

import AccountContext from "./../../account/AccountContext";
import useInput from "./../../../hooks/useInput";
import { ProfileImgInput } from "./StyledComponent";
import { AddCookie } from "../../../util/Utils";

export default ({ close }) => {
  const { username, setProfileImage } = useContext(AccountContext);
  const { value: image, bind: bindimage, reset: resetimage } = useInput("");

  const addProfileImage = async () => {
    AddCookie("AioFeed_AccountProfileImg", image);
    setProfileImage(image);
    await axios
      .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        columnValue: image,
        columnName: "ProfileImg",
      })
      .then(() => {
        close();
      })
      .catch((error) => {
        console.error(error);
      });
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
