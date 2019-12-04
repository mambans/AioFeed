import axios from "axios";
import React, { useState } from "react";

import Utilities from "../../utilities/Utilities";
import "./updateProfilePopup.scss";

function UpdateProfileImg() {
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
      .put(`http://localhost:3100/notifies/account/profile/image`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        profileImage: image,
      })
      .then(() => {
        document.cookie = `Notifies_AccountProfileImg=${image}; path=/`;
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
