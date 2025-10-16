import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { registerAction, loginAction } from "./actions";
import { allJobsLoader, dashboardLoader, jobLoader } from "./loaders";
import { addJobAction } from "./actions/AddJobAction";

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
                    },
                    {
                        path: "admin",
                        element: <Admin />,
                    },
                ],
            },
        ],
    },
]);

const App = () => {
    return <RouterProvider router={router} />;
};

export default App;
