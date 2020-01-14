export default async themesArray => {
  const currentMonth = new Date().getMonth() + 1;
  const currentDate = new Date().getDate();

  if (!localStorage.getItem("activeTheme") || localStorage.getItem("activeTheme") === "default") {
    const startTheme = await themesArray.find(theme => {
      return (
        theme.startMonth <= currentMonth &&
        theme.endMonth >= currentMonth &&
        theme.startDate <= currentDate &&
        theme.endDate >= currentDate
      );
    });

    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute(
      "data-theme",
      startTheme ? startTheme.name : themesArray[1].name
    );
    window.setTimeout(function() {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  } else {
    console.log("Theme:", localStorage.getItem("activeTheme"));
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", localStorage.getItem("activeTheme"));
    window.setTimeout(function() {
      document.documentElement.classList.remove("theme-transition");
    }, 1000);
  }
};
