import { Form, Link, useNavigate } from "react-router-dom";
import Wrapper from "../../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow, SubmitButton } from "../../components";
import { useAppContext } from "../../context/AppContext";

const Login = () => {
    const { setIsExplore } = useAppContext();
    const navigate = useNavigate();

    const exploreApp = () => {
        setIsExplore(true);
        navigate("/dashboard");
    };

    return (
        <Wrapper>
            <Form className="form" method="post">
                <Logo />
                <h4>login</h4>

                <FormRow type="email" name="email" defaultValue="thales@thales.com" />

                <FormRow type="password" name="password" defaultValue="" />

                <SubmitButton text="Login" submittingText="Logging in..." />

                <button type="button" className="btn btn-block" onClick={exploreApp}>
                    explore the app
                </button>
                <p>
                    Not a member?
                    <Link to="/register" className="member-btn">
                        Register
                    </Link>
                </p>
            </Form>
        </Wrapper>
    );
};

export default Login;
