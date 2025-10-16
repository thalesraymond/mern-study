import type { JSX } from "react";
import { useDashboardContext } from "../pages/dashboard/DashboardContext";
import links from "../utils/Links";
import { NavLink } from "react-router-dom";

const NavLinks = (options: { isBigSidebar?: boolean }) => {
    const data = useDashboardContext();

    return (
        <div className="nav-links">
            {links.map(
                (link: { text: string; path: string; icon: JSX.Element }) => {
                    return (
                        <NavLink
                            to={link.path}
                            key={link.text}
                            className={"nav-link"}
                            onClick={() =>
                                !options.isBigSidebar
                                    ? data.toggleSidebar()
                                    : null
                            }
                            end
                        >
                            <span className="icon">{link.icon}</span>
                            {link.text}
                        </NavLink>
                    );
                }
            )}
        </div>
    );
};

export default NavLinks;
