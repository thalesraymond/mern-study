import { FormRow, SubmitButton } from "../components";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { useOutletContext } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../utils/Constants";
import { Form, useNavigation, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import apiClient from "../utils/ApiClient";
import FormRowSelect from "../components/FormRowSelect";

const AddJob = () => {
    const { user } = useOutletContext() as { user: { location: string } };

    return (
        <Wrapper>
            <Form method="post" className="form">
                <h4 className="form-title">add job</h4>
                <div className="form-center">
                    <FormRow type="text" name="position" />
                    <FormRow type="text" name="company" />
                    <FormRow type="text" labelText="job location" name="jobLocation" defaultValue={user.location} />
                    <FormRowSelect
                        labelText="job status"
                        name="jobStatus"
                        defaultValue={JOB_STATUS.PENDING}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        name="jobType"
                        labelText="job type"
                        defaultValue={JOB_TYPE.FULL_TIME}
                        list={Object.values(JOB_TYPE)}
                    />
                    <SubmitButton text="submit" submittingText="submitting..." aditionalCssClasses="form-btn" />
                </div>
            </Form>
        </Wrapper>
    );
};

export default AddJob;
