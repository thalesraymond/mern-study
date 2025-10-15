import { Link, Form } from "react-router-dom";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import { FormRow, Logo, SubmitButton } from "../components";

const Register = () => {
    return (
        <Wrapper>
            <Form method="post" className="form">
                <Logo />
                <h4>Register</h4>

                <FormRow type="text" name="name" defaultValue="john" />

                <FormRow type="text" name="lastName" labelText="last name" defaultValue="smith" />

                <FormRow type="text" name="location" defaultValue="earth" />

                <FormRow type="email" name="email" defaultValue="thales@thales.com" />

                <FormRow type="password" name="password" defaultValue="1q2w3e$R" />

                <SubmitButton text="Register" submittingText="Submitting..." />

                <p>
                    Already a member?
                    <Link to="/login" className="member-btn">
                        Login
                    </Link>
                </p>
            </Form>
        </Wrapper>
    );
};

export default Register;
