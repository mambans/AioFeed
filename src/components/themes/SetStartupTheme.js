const SetStartupTheme = () => {
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();
  console.log("TCL: SetStartupTheme -> currentMonth", currentMonth);
  console.log("TCL: SetStartupTheme -> currentDate", currentDate);

  switch (currentMonth) {
    case 11:
      document.documentElement.classList.add("theme-transition");
      document.documentElement.setAttribute("data-theme", "christmas");
      localStorage.setItem("activeTheme", "christmas");
      window.setTimeout(function() {
        document.documentElement.classList.remove("theme-transition");
      }, 1000);
      break;
    case 0:
      if (currentDate <= 7) {
        document.documentElement.classList.add("theme-transition");
        document.documentElement.setAttribute("data-theme", "new year's eve");
        localStorage.setItem("activeTheme", "new year's eve");
        window.setTimeout(function() {
          document.documentElement.classList.remove("theme-transition");
        }, 1000);
      }
      break;
    default:
      if (localStorage.getItem("activeTheme")) {
        document.documentElement.classList.add("theme-transition");
        document.documentElement.setAttribute("data-theme", localStorage.getItem("activeTheme"));
        window.setTimeout(function() {
          document.documentElement.classList.remove("theme-transition");
        }, 1000);
      }
  }

  // if (currentMonth === 11) {
  //   document.documentElement.classList.add("theme-transition");
  //   document.documentElement.setAttribute("data-theme", "christmas");
  //   localStorage.setItem("activeTheme", "christmas");
  //   window.setTimeout(function() {
  //     document.documentElement.classList.remove("theme-transition");
  //   }, 1000);
  // } else if (
  //   (currentMonth === 11 && currentDate === 31) ||
  //   (currentMonth === 0 && currentDate <= 7) ||
  //   (currentMonth === 9 && currentDate === 20)
  // ) {
  //   document.documentElement.classList.add("theme-transition");
  //   document.documentElement.setAttribute("data-theme", "new year's eve");
  //   localStorage.setItem("activeTheme", "new year's eve");
  //   window.setTimeout(function() {
  //     document.documentElement.classList.remove("theme-transition");
  //   }, 1000);
  // } else if (localStorage.getItem("activeTheme")) {
  //   document.documentElement.classList.add("theme-transition");
  //   document.documentElement.setAttribute("data-theme", localStorage.getItem("activeTheme"));
  //   window.setTimeout(function() {
  //     document.documentElement.classList.remove("theme-transition");
  //   }, 1000);
  // }
};

export default SetStartupTheme;
