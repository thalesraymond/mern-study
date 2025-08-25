export const getSavedDarkTheme = () => {
  const isDarkTheme = JSON.parse(
    localStorage.getItem("isDarkTheme") || "false"
  ) as boolean;

  document.body.classList.toggle("dark-theme", isDarkTheme);

  return isDarkTheme;
};
