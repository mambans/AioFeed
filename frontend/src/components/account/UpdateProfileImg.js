import axios from "axios";
import React, { useState, useContext } from "react";

import "./updateProfilePopup.scss";
import AccountContext from "./../account/AccountContext";

function UpdateProfileImg() {
  const { username, setProfileImage } = useContext(AccountContext);

  const useInput = initialValue => {
    const [value, setValue] = useState(initialValue);

    return {
      value,
      setValue,
      reset: () => setValue(""),
      bind: {
        value,
        onChange: event => {
          setValue(event.target.value);
        },
      },
    };
  };

  const { value: image, bind: bindimage, reset: resetimage } = useInput("");

  async function addProfileImage() {
    await axios
      .put(`https://1zqep8agka.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
        username: username,
        token: image,
        tokenName: "ProfileImg",
      })
      .then(() => {
        document.cookie = `Notifies_AccountProfileImg=${image}; path=/`;
        setProfileImage(image);
      })
      .catch(error => {
        console.error(error);
      });
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    addProfileImage();
    resetimage();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label>
          Enter image url:
          <input type='text' placeholder='Img url..' {...bindimage} />
        </label>
        <input type='submit' value='Update' />
      </form>
    </>
  );
}

export default UpdateProfileImg;
