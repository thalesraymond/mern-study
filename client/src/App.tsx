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
  Admin
} from "./pages";


export const getSavedDarkTheme = () => {
  const isDarkTheme = JSON.parse(
    localStorage.getItem("isDarkTheme") || "false"
  ) as boolean;

  document.body.classList.toggle("dark-theme", isDarkTheme);

  return isDarkTheme;
};

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
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <AddJob />,
          },
          {
            path: "stats",
            element: <Stats />,
          },
          {
            path: "all-jobs",
            element: <AllJobs />,
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
