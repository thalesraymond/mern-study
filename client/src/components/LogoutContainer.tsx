import { useState } from "react";
import { useDashboardContext } from "../pages/dashboard/DashboardContext";
import Wrapper from "../assets/wrappers/LogoutContainer";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";

const LogoutContainer = () => {
    const data = useDashboardContext();

    const [showLogout, setShowLogout] = useState(false);

    return (
        <Wrapper>
            <button type="button" className="btn logout-btn" onClick={() => setShowLogout(!showLogout)}>
                {data.user.imageId ? (
                    <img src={`/api/v1/user/profile-image?id=${data.user.imageId}`} className="img" />
                ) : (
                    <FaUserCircle />
                )}
                {data.user.name}
                <FaCaretDown />
            </button>
            <div className={showLogout ? "dropdown show-dropdown" : "dropdown"}>
                <button type="button" className="dropdown-btn" onClick={data.logoutUser}>
                    logout
                </button>
            </div>
        </Wrapper>
    );
};

export default LogoutContainer;
