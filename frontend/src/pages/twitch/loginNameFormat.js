const loginNameFormat = (data, returnUserName = false) => {
  const { user_name, user_login, login, broadcaster_name, name, display_name, to_login, to_name } =
    data || {};
  const userName = display_name || broadcaster_name || user_name || name || user_login || to_name;
  const englishName = login || user_login || to_login || userName;

  if (returnUserName) return englishName;
  const rightName =
    userName?.toLowerCase() !== englishName?.toLowerCase() && englishName ? `(${englishName})` : '';

  return userName && `${userName} ${rightName}`.trim();
};
export default loginNameFormat;
