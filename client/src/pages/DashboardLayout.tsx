import { Outlet } from "react-router-dom";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";

const DashboardLayout = () => {
  return (
    <Wrapper>
      <main className="dashboard">
        <SmallSidebar></SmallSidebar>
        <BigSidebar></BigSidebar>
        <div>
          <Navbar></Navbar>
          <div className="dashboard-page">
            <Outlet />
          </div>
        </div>
      </main>
    </Wrapper>
  );
};

export default DashboardLayout;
