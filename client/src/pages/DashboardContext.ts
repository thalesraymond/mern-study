import { createContext, useContext } from "react";

const DashboardContext = createContext({});

export default DashboardContext;
export const useDashboardContext = () => useContext(DashboardContext);