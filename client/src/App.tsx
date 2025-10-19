import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProvider } from "./context/AppContext";
import { DashboardLayout, HomeLayout, Landing, Login, Register, Error, AddJob } from "./pages";
import { lazy } from "react";

const Stats = lazy(() => import("./pages/jobStats/Stats"));
const AllJobs = lazy(() => import("./pages/listJobs/AllJobs"));
const Profile = lazy(() => import("./pages/userProfile/Profile"));
const Admin = lazy(() => import("./pages/admin/Admin"));

import addJobAction from "./pages/editJobs/AddJobAction";
import loginAction from "./pages/login/LoginAction";
import registerAction from "./pages/register/RegisterAction";
import dashboardLoader from "./pages/dashboard/DashboardLoader";
import jobLoader from "./pages/editJobs/JobLoader";
import allJobsLoader from "./pages/listJobs/AllJobsLoader";
import deleteJobAction from "./pages/deleteJob/deleteJobAction";
import adminStatsLoader from "./pages/admin/AdminStatsLoader";
import { action as profileAction } from "./pages/userProfile/action";
import jobStatsLoader from "./pages/jobStats/JobStatsLoader";
import ErrorComponent from "./components/ErrorComponent";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
        },
    },
});

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
                        loader: jobStatsLoader,
                        errorElement: <ErrorComponent />,
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
            <QueryClientProvider client={queryClient}>
                <ReactQueryDevtools initialIsOpen={true} />
                <RouterProvider router={router} />
            </QueryClientProvider>
        </AppProvider>
    );
};

export default App;
