import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import {
    DashboardLayout,
    HomeLayout,
    Landing,
    Login,
    Register,
    Error,
    AddJob,
    Stats,
    AllJobs,
    Profile,
    Admin,
} from "./pages";
import addJobAction from "./pages/editJobs/AddJobAction";
import loginAction from "./pages/login/LoginAction";
import registerAction from "./pages/register/RegisterAction";
import dashboardLoader from "./pages/dashboard/DashboardLoader";
import jobLoader from "./pages/editJobs/JobLoader";
import allJobsLoader from "./pages/listJobs/AllJobsLoader";
import deleteJobAction from "./pages/deleteJob/deleteJobAction";
import adminStatsLoader from "./pages/admin/AdminStatsLoader";
import { action as profileAction } from "./pages/userProfile/action";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                element: <Landing />,
            },
            {
                path: "register",
                element: <Register />,
                action: registerAction,
            },
            {
                path: "login",
                element: <Login />,
                action: loginAction,
            },
            {
                path: "dashboard",
                element: <DashboardLayout />,
                loader: dashboardLoader,
                children: [
                    {
                        index: true,
                        element: <AddJob />,
                        action: addJobAction,
                    },
                    {
                        path: "edit-job/:jobId",
                        element: <AddJob />,
                        action: addJobAction,
                        loader: jobLoader,
                    },
                    {
                        path: "stats",
                        element: <Stats />,
                    },
                    {
                        path: "all-jobs",
                        element: <AllJobs />,
                        loader: allJobsLoader,
                    },
                    {
                        path: "profile",
                        element: <Profile />,
                        action: profileAction,
                    },
                    {
                        path: "admin",
                        element: <Admin />,
                        loader: adminStatsLoader,
                    },
                    {
                        path: "delete-job/:jobId",
                        action: deleteJobAction,
                    },
                ],
            },
        ],
    },
]);

const App = () => {
    return (
        <AppProvider>
            <RouterProvider router={router} />
        </AppProvider>
    );
};

export default App;
