const loginNameFormat = (data) => {
  const { user_name, login, broadcaster_name, name, display_name } = data || {};
  const userName = display_name || broadcaster_name || user_name || name;

  const rightName =
    (userName?.toLowerCase() !== login?.toLowerCase() && login && `(${login})`) || '';

  return userName && `${userName} ${rightName}`.trim();
};
export default loginNameFormat;
