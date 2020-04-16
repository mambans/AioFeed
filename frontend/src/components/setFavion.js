export default (icon) => {
  let favicon = document.querySelector('link[rel="shortcut icon"]');

  if (!favicon) {
    favicon = document.createElement("link");
    favicon.setAttribute("rel", "shortcut icon");
    const head = document.querySelector("head");
    head.appendChild(favicon);
  }

  favicon.setAttribute("type", "image/png");
  favicon.setAttribute("href", icon);
};
