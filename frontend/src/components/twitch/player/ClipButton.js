import React, { useEffect, useCallback } from "react";

import { CreateClipButton } from "./StyledComponents";
import API from "../API";
import validateToken from "../validateToken";

const CreateAndOpenClip = async ({ streamInfo }) => {
  const Width = window.screen.width * 0.6;
  const Height = 920;
  const LeftPosition = (window.screen.width - Width) / 2;
  const TopPosition = (window.screen.height - Height) / 2;
  const settings = `height=${Height},width=${Width},top=${TopPosition},left=${LeftPosition},scrollbars,resizable,status,location,toolbar,`;

  await validateToken().then(async () => {
    await API.postClip({ params: { broadcaster_id: streamInfo.user_id } })
      .then((res) => {
        window.open(res.data.data[0].edit_url, `N| Clip - ${res.data.data[0].id}`, settings);
      })
      .catch((er) => {
        console.error("CreateAndOpenClip -> er", er);
      });
  });
};

export default ({ streamInfo }) => {
  const keyboardEvents = useCallback(
    (e) => {
      switch (e.key) {
        case "c":
        case "C":
          CreateAndOpenClip({ streamInfo });
          break;
        default:
          break;
      }
    },
    [streamInfo]
  );

  useEffect(() => {
    if (streamInfo) document.body.addEventListener("keydown", keyboardEvents);

    return () => {
      document.body.removeEventListener("keydown", keyboardEvents);
    };
  }, [keyboardEvents, streamInfo]);

  return (
    <CreateClipButton
      title='Create clip (c)'
      disabled={!streamInfo}
      onClick={() => {
        CreateAndOpenClip({ streamInfo });
      }}
    />
  );
};
