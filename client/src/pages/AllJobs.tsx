import { useLoaderData } from "react-router-dom";
import { JobsContainer, SearchContainer } from "../components";
import AllJobsContext from "./listJobs/AllJobsContext";

const AllJobs = () => {
    const { jobs } = useLoaderData();
    return (
        <AllJobsContext.Provider value={{ jobs }}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    );
};

export default AllJobs;
