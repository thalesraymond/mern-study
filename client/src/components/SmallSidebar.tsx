import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/SmallSidebar";
import { useDashboardContext } from "../pages/DashboardContext";
import Logo from "./Logo";
import { NavLinks } from ".";

const SmallSidebar = () => {
  const data = useDashboardContext();
  return (
    <Wrapper>
      <div
        className={
          data.showSidebar
            ? "sidebar-container show-sidebar"
            : "sidebar-container"
        }
      >
        <div className="content">
          <button
            type="button"
            className="close-btn"
            onClick={() => data.toggleSidebar()}
          >
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
