const SetStartupTheme = () => {
  const currentMonth = new Date().getMonth();
  const currentDate = new Date().getDate();

  if (localStorage.getItem("activeTheme") === "default" || !localStorage.getItem("activeTheme")) {
    switch (currentMonth) {
      case 11:
        document.documentElement.classList.add("theme-transition");
        document.documentElement.setAttribute("data-theme", "christmas");
        window.setTimeout(function() {
          document.documentElement.classList.remove("theme-transition");
        }, 1000);
        break;
      case 0:
        if (currentDate <= 1) {
          document.documentElement.classList.add("theme-transition");
          document.documentElement.setAttribute("data-theme", "new year's eve");
          window.setTimeout(function() {
            document.documentElement.classList.remove("theme-transition");
          }, 1000);
        }
        break;
      default:
        document.documentElement.classList.add("theme-transition");
        document.documentElement.setAttribute("data-theme", "default");
        window.setTimeout(function() {
          document.documentElement.classList.remove("theme-transition");
        }, 1000);
    }
  } else {
    console.log("theme: ", localStorage.getItem("activeTheme"));
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", localStorage.getItem("activeTheme"));
    window.setTimeout(function() {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  }
};

export default SetStartupTheme;
