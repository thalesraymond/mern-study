import {Outlet} from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import {BigSidebar, Navbar, SmallSidebar} from "../components";
import {useState} from "react";
import DashboardContext from "./DashboardContext";

const DashboardLayout = () => {
    // TODO: Temp
    const user = {name: "john"};
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    const toggleDarkTheme = () => {
        console.log("toggle dark theme");
        setIsDarkTheme(!isDarkTheme);
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const logoutUser = async () => {
        console.log("logout user");
    };

    return (
        <DashboardContext.Provider
            value={
                {
                    user,
                    showSidebar,
                    isDarkTheme,
                    toggleDarkTheme,
                    toggleSidebar,
                    logoutUser
                }}>
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar></SmallSidebar>
                    <BigSidebar></BigSidebar>
                    <div>
                        <Navbar></Navbar>
                        <div className="dashboard-page">
                            <Outlet/>
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};


export default DashboardLayout;
