import { createContext, useContext } from "react";

const DashboardContext = createContext({
    user: {
        name: "",
        role: "",
        imageId: ""
    },
    showSidebar: false,
    isDarkTheme: false,
    toggleDarkTheme: () => {},
    toggleSidebar: () => {},
    logoutUser: () => {},
});

export default DashboardContext;
export const useDashboardContext = () => useContext(DashboardContext);
