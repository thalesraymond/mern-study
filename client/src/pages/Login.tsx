import { Form, Link } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { Logo, FormRow, SubmitButton } from "../components";

const Login = () => {
    return (
        <Wrapper>
            <Form className="form" method="post">
                <Logo />
                <h4>login</h4>

                <FormRow type="email" name="email" defaultValue="thales@thales.com" />

                <FormRow type="password" name="password" defaultValue="1q2w3e$R" />

                <SubmitButton text="Login" submittingText="Logging in..." />

                <button type="button" className="btn btn-block">
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
