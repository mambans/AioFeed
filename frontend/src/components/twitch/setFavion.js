const setFavicon = (icon) => {
  let favicon = document.querySelector('link[rel="icon"]');

  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'shortcut icon');
    const head = document.querySelector('head');
    head.appendChild(favicon);
  }

  favicon.setAttribute('type', 'image/png');
  favicon.setAttribute('href', icon || `${process.env.PUBLIC_URL}/favicon-32x32.png`);
};
export default setFavicon;
