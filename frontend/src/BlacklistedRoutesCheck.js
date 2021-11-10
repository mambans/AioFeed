export const blacklistedRoutes = ['', 'index', 'home', 'legality', 'privacy', 'auth'];

const blacklistedRoutesCheck = () =>
  !blacklistedRoutes.includes(window.location.pathname?.split('/')[1]);

export default blacklistedRoutesCheck;
