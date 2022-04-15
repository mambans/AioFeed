const loginNameFormat = (data) => {
  const { user_name, user_login, login, broadcaster_name, name, display_name } = data || {};
  const userName = display_name || broadcaster_name || user_name || name || user_login;

  const rightName =
    userName?.toLowerCase() !== (login || user_login)?.toLowerCase() && (login || user_login)
      ? `(${login || user_login})`
      : '';

  return userName && `${userName} ${rightName}`.trim();
};
export default loginNameFormat;
