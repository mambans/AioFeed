import React, { useContext } from 'react';

import AccountContext from './../../account/AccountContext';
import { InlineError } from './StyledComponents';

const AccountDetails = () => {
  const { user } = useContext(AccountContext);

  return (
    <>
      <h1 style={{ fontSize: '2rem', textAlign: 'center' }} title='Username'>
        {user?.username}
      </h1>
      <p style={{ textAlign: 'center' }} title='Email'>
        {user.attributes?.email}
        {!user.attributes?.email_verified && <InlineError> not verified</InlineError>}
      </p>
    </>
  );
};

export default AccountDetails;
