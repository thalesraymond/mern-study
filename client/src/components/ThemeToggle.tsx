import Wrapper from "../assets/wrappers/ThemeToggle";
import { useDashboardContext } from "../pages/dashboard/DashboardContext";
import { BsFillSunFill, BsFillMoonFill } from "react-icons/bs";

const ThemeToggle = () => {
    const data = useDashboardContext();
    return (
        <Wrapper onClick={data.toggleDarkTheme}>
            {data.isDarkTheme ? (
                <BsFillSunFill className="toggle-icon" />
            ) : (
                <BsFillMoonFill className="toggle-icon" />
            )}
        </Wrapper>
    );
};

export default ThemeToggle;
