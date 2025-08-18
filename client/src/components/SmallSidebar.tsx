import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/SmallSidebar";
import { useDashboardContext } from "../pages/DashboardContext";
import Logo from "./Logo";
import links from "../utils/Links";
import type { JSX } from "react";
import { NavLink } from "react-router-dom";

const SmallSidebar = () => {
  const data = useDashboardContext();

  console.log(data);
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
          <div className="nav-links">
            {links.map(
              (link: { text: string; path: string; icon: JSX.Element }) => {
                return (
                  <NavLink
                    to={link.path}
                    key={link.text}
                    className={"nav-link"}
                    onClick={() => data.toggleSidebar()}
                  >
                    <span className="icon">{link.icon}</span>
                    {link.text}
                  </NavLink>
                );
              }
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
