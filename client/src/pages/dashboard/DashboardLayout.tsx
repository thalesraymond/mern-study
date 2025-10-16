import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import Wrapper from "../../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../../components";
import { useState } from "react";
import DashboardContext from "./DashboardContext";
import { getSavedDarkTheme } from "../../DarkThemeSwitcher";
import apiClient from "../../utils/ApiClient";
import { toast } from "react-toastify";

const DashboardLayout = () => {
    const navigate = useNavigate();
    const loaderData: {
        user: {
            name: string;
            lastName: string;
            location: string;
            email: string;
            role: string;
        };
    } = useLoaderData();
    const user = loaderData.user;
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(getSavedDarkTheme());

    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme;

        setIsDarkTheme(newDarkTheme);

        document.body.classList.toggle("dark-theme", newDarkTheme);

        localStorage.setItem("isDarkTheme", JSON.stringify(newDarkTheme));
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const logoutUser = async () => {
        navigate("/");

        apiClient.get("/auth/logout");

        toast.success("User logged out successfully");
    };

    return (
        <DashboardContext.Provider
            value={{
                user,
                showSidebar,
                isDarkTheme,
                toggleDarkTheme,
                toggleSidebar,
                logoutUser,
            }}
        >
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar></SmallSidebar>
                    <BigSidebar></BigSidebar>
                    <div>
                        <Navbar></Navbar>
                        <div className="dashboard-page">
                            <Outlet context={{ user }} />
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    );
};

export default DashboardLayout;
