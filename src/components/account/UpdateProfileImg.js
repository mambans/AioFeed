import axios from "axios";
// eslint-disable-next-line
import React, { useEffect, useState, useCallback } from "react";

import Utilities from "./../../utilities/Utilities";
import "./updateProfilePopup.scss";

function UpdateProfileImg({ data }) {
  console.log("TCL: UpdateProfileImg -> data", data);

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
    try {
      await axios.put(`http://localhost:3100/notifies/account/profile/image`, {
        accountName: Utilities.getCookie("Notifies_AccountName"),
        accountEmail: Utilities.getCookie("Notifies_AccountEmail"),
        profileImage: image,
      });

      document.cookie = `Notifies_AccountProfileImg=${image}; path=/`;

      data.data.setRefresh(!data.data.refresh);
    } catch (e) {
      console.log(e.message);
    }
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    addProfileImage();
    resetimage();
  };

  useEffect(() => {
    return () => {};
  }, []);

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
