import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { GoogleLogin as ReactGoogleLogin } from 'react-google-login';
import { useGoogleLogin } from 'react-google-login';
import { FcGoogle } from 'react-icons/fc';

const GoogleLogin = () => {
  const onSuccess = (res) => {
    console.log('Login Success: currentUser:', res.profileObj);

    // refreshTokenSetup(res);
  };

  const onFailure = (res) => {
    console.log('Login failed: res:', res);
  };
  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: process.env.REACT_APP_YOUTUBE_CLIENT_ID,
    isSignedIn: true,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  });

  // const responseGoogle = (e) => {
  //   console.log('e:', e);
  // };

  return (
    <Button onClick={signIn}>
      <FcGoogle />
      Sign in with Google
    </Button>
    // <ReactGoogleLogin
    //   clientId={process.env.REACT_APP_YOUTUBE_CLIENT_ID}
    //   buttonText='Login'
    //   onSuccess={responseGoogle}
    //   onFailure={responseGoogle}
    //   cookiePolicy={'single_host_origin'}
    // />
  );
};
export default GoogleLogin;
