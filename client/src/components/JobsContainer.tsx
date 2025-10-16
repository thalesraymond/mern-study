import Wrapper from "../assets/wrappers/JobsContainer";

import { useAllJobsContext } from "../pages/listJobs/AllJobsContext";
import Job from "./Job";

const JobsContainer = () => {
    const { jobs } = useAllJobsContext();
    if (jobs.length === 0) {
        return (
            <Wrapper>
                <h2>No jobs to display...</h2>
            </Wrapper>
        );
    }

    return (
        <Wrapper>
            <div className="jobs">
                {jobs.map((job) => {
                    return <Job key={job.id} {...job} />;
                })}
            </div>
        </Wrapper>
    );
};

export default JobsContainer;
