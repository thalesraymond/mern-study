import { useState } from "react";
import { useDashboardContext } from "../pages/DashboardContext";
import Wrapper from "../assets/wrappers/LogoutContainer";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";

const LogoutContainer = () => {
    const data = useDashboardContext();

    const [showLogout, setShowLogout] = useState(false);

    return (
        <Wrapper>
            <button
                type="button"
                className="btn logout-btn"
                onClick={() => setShowLogout(!showLogout)}
            >
                <FaUserCircle />
                {data.user?.name}
                <FaCaretDown />
            </button>
            <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
                <button
                    type="button"
                    className="dropdown-btn"
                    onClick={data.logoutUser}
                >
                    logout
                </button>
            </div>
        </Wrapper>
    );
};

export default LogoutContainer;
