import Wrapper from "../assets/wrappers/BigSidebar";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useDashboardContext } from "../pages/DashboardContext";

const BigSidebar = () => {
    const data = useDashboardContext();

    return (
        <Wrapper>
            <div
                className={
                    data.showSidebar
                        ? "sidebar-container"
                        : "sidebar-container show-sidebar"
                }
            >
                <div className="content">
                    <header>
                        <Logo />
                    </header>

                    <NavLinks isBigSidebar />
                </div>
            </div>
        </Wrapper>
    );
};

export default BigSidebar;
