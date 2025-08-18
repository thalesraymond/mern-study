import type { JSX } from "react";
import { useDashboardContext } from "../pages/DashboardContext";
import links from "../utils/Links";
import { NavLink } from "react-router-dom";

const NavLinks = () => {
  const data = useDashboardContext();
  console.log(data);
  
  return (
    <div className="nav-links">
      {links.map((link: { text: string; path: string; icon: JSX.Element }) => {
        return (
          <NavLink
            to={link.path}
            key={link.text}
            className={"nav-link"}
            onClick={() => data.toggleSidebar()}
            end
          >
            <span className="icon">{link.icon}</span>
            {link.text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
