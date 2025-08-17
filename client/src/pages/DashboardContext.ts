import { createContext, useContext } from "react";

const DashboardContext = createContext({
    user: {},
    showSidebar: false,
    isDarkTheme: false,
    toggleDarkTheme: () => {},
    toggleSidebar: () => {},
    logoutUser: () => {}
});

export default DashboardContext;
export const useDashboardContext = () => useContext(DashboardContext);