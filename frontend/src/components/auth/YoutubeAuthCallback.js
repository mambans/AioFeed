import React, { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";

import Util from "../../util/Util";
import ErrorHandler from "./../error";
import AccountContext from "./../account/AccountContext";
import NavigationContext from "./../navigation/NavigationContext";
import LoadingIndicator from "../LoadingIndicator";
import { AddCookie } from "../../util/Utils";

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default () => {
  const { setVisible, setFooterVisible } = useContext(NavigationContext);
  const [error, setError] = useState();
  const { username } = useContext(AccountContext);

  const getAccessToken = useCallback(async () => {
    const url = new URL(window.location.href);

    const accessToken = getParameterByName("access_token");
    const accessTokenExpireParam = getParameterByName("expires_in");

    const validateToken = await axios
      .post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`)
      .catch((error) => {
        console.log(error);
      });

    if (validateToken.data.aud === process.env.REACT_APP_YOUTUBE_CLIENT_ID) {
      AddCookie("Youtube-access_token", accessToken);
      AddCookie("Youtube-access_token_expire", accessTokenExpireParam);
      AddCookie("Youtube-readonly", url.hash.includes(".readonly"));

      await axios
        .put(`https://44rg31jaa9.execute-api.eu-north-1.amazonaws.com/Prod/account/update`, {
          username: username,
          columnValue: accessToken,
          columnName: "YoutubeToken",
        })
        .catch((e) => {
          console.error(e);
        });

      const MyYoutube = await axios
        .get(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=${process.env.REACT_APP_YOUTUBE_API_KEY}`,
          {
            headers: {
              Authorization: "Bearer " + Util.getCookie("Youtube-access_token"),
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          AddCookie("YoutubeUsername", res.data.items[0].snippet.title);
          AddCookie("YoutubeProfileImg", res.data.items[0].snippet.thumbnails.default.url);

          return {
            Username: res.data.items[0].snippet.title,
            ProfileImg: res.data.items[0].snippet.thumbnails.default.url,
          };
        });

      return { token: accessToken, ...MyYoutube };
    }
  }, [username]);

  useEffect(() => {
    setVisible(false);
    setFooterVisible(false);

    (async () => {
      const url = new URL(window.location.href);
      try {
        if (url.hash.split("#")[1].split("&")[0].slice(6) === Util.getCookie("Youtube-myState")) {
          await getAccessToken()
            .then((res) => {
              console.log("successfully authenticated to Youtube.");
              window.opener.postMessage(
                {
                  service: "youtube",
                  token: res.token,
                  username: res.Username,
                  profileImg: res.ProfileImg,
                },
                "*"
              );

              setTimeout(() => {
                window.close();
              }, 1);
            })
            .catch((error) => {
              setError(error);
            });
        } else {
          setError({ message: "Request didn't come from this website." });
        }
      } catch (error) {
        setError(error);
      }
    })();
  }, [getAccessToken, setVisible, setFooterVisible]);

  if (error) {
    return <ErrorHandler data={error}></ErrorHandler>;
  } else {
    return <LoadingIndicator height={150} width={150} />;
  }
};
