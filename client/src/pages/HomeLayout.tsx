import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <div>
      <nav>NavBar goes here</nav>
      <Outlet />
    </div>
  );
};
export default HomeLayout;
