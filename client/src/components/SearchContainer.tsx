import { FormRow, FormRowSelect, SubmitButton } from ".";
import Wrapper from "../assets/wrappers/DashboardFormPage";
import { Form, Link } from "react-router-dom";
import { JOB_TYPE, JOB_STATUS, JOB_SORT_BY } from "../utils/Constants";
import { useAllJobsContext } from "../pages/listJobs/AllJobsContext";

const SearchContainer = () => {
    const { searchValues } = useAllJobsContext();
    const { search, jobStatus, jobType, sort } = searchValues;
    return (
        <Wrapper>
            <Form className="form">
                <h5 className="form-title">search form</h5>
                <div className="form-center">
                    {/* search position */}

                    <FormRow type="search" name="search" defaultValue={search} required={false} />
                    <FormRowSelect
                        labelText="job status"
                        name="jobStatus"
                        list={["all", ...Object.values(JOB_STATUS)]}
                        defaultValue={jobStatus}
                    />
                    <FormRowSelect
                        labelText="job type"
                        name="jobType"
                        list={["all", ...Object.values(JOB_TYPE)]}
                        defaultValue={jobType}
                    />
                    <FormRowSelect name="sort" defaultValue={sort} list={[...Object.values(JOB_SORT_BY)]} />

                    <Link to="/dashboard/all-jobs" className="btn form-btn delete-btn">
                        Reset Search Values
                    </Link>
                    {/* TEMP!!!! */}
                    <SubmitButton text="search" submittingText="searching..." />
                </div>
            </Form>
        </Wrapper>
    );
};

export default SearchContainer;
