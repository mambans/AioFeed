import axios from "axios";
import { getCookie, AddCookie } from "../../util/Utils";
import autoReauthenticate from "./autoReauthenticate";

export default async ({ authKey }) => {
  const expireDate = new Date(Date.now() + 20000);
  const access_token = getCookie("Youtube-access_token");

  if (!getCookie("Youtube_token_validated")) {
    console.log("Validating access_token..");
    await axios
      .post(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${access_token}`)
      .then((res) => {
        console.log("Valid Access_token");
        AddCookie("Youtube_token_validated", true, expireDate);
        return res.data;
      })
      .catch((error) => {
        console.log("Invalid Access_token");
        return autoReauthenticate({ authKey }).then((res) => {
          console.log("New Access_token fetched");
          AddCookie("Youtube_token_validated", true, expireDate);
          return res;
        });
      });
  } else {
    return true;
  }
};
