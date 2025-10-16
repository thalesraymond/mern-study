import { FormRow, FormRowSelect, SubmitButton } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useLoaderData, useOutletContext } from "react-router-dom";
import { JOB_STATUS, JOB_TYPE } from "../../utils/Constants";
import { Form } from "react-router-dom";

const AddJob = () => {
    const { user } = useOutletContext() as { user: { location: string } };

    const job = useLoaderData() as {
        id: string;
        position: string;
        company: string;
        status: string;
        jobType: string;
        location: string;
    } | null;

    const isEditing = Boolean(job);

    return (
        <Wrapper>
            <Form method="post" className="form">
                <h4 className="form-title"> {isEditing ? "edit job" : "add job"}</h4>
                <div className="form-center">
                    <FormRow type="text" name="position" defaultValue={job?.position ?? ""} />
                    <FormRow type="text" name="company" defaultValue={job?.company ?? ""} />
                    <FormRow
                        type="text"
                        labelText="job location"
                        name="location"
                        defaultValue={job?.location ?? user?.location ?? ""}
                    />
                    <FormRowSelect
                        labelText="job status"
                        name="status"
                        defaultValue={job?.status ?? JOB_STATUS.PENDING}
                        list={Object.values(JOB_STATUS)}
                    />
                    <FormRowSelect
                        name="jobType"
                        labelText="job type"
                        defaultValue={job?.jobType ?? JOB_TYPE.FULL_TIME}
                        list={Object.values(JOB_TYPE)}
                    />
                    <SubmitButton text="submit" submittingText="submitting..." aditionalCssClasses="form-btn" />
                </div>
            </Form>
        </Wrapper>
    );
};

export default AddJob;
