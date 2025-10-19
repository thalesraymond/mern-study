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
    logoutUser: async () => {},
});

export default DashboardContext;
export const useDashboardContext = () => useContext(DashboardContext);
