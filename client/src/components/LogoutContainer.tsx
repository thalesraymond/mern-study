import { useState } from "react";
import { useDashboardContext } from "../pages/dashboard/DashboardContext";
import Wrapper from "../assets/wrappers/LogoutContainer";
import { FaCaretDown, FaUserCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { profileImageQuery } from "../queries/imageQuery";

const LogoutContainer = () => {
    const data = useDashboardContext();

    const [showLogout, setShowLogout] = useState(false);

    const { data: imageBlob, isLoading } = useQuery({
        ...profileImageQuery(data.user.imageId),
        enabled: !!data.user.imageId,
    });

    const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : null;

    return (
        <Wrapper>
            <button type="button" className="btn logout-btn" onClick={() => setShowLogout(!showLogout)}>
                {isLoading ? (
                    <FaUserCircle />
                ) : imageUrl ? (
                    <img src={imageUrl} className="img" alt="profile" />
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
