import { useLoaderData } from "react-router-dom";
import { JobsContainer, SearchContainer } from "../../components";
import AllJobsContext from "./AllJobsContext";

const AllJobs = () => {
    const { jobs, searchValues, totalJobs, numOfPages, currentPage } = useLoaderData();
    return (
        <AllJobsContext.Provider value={{ jobs, searchValues, totalJobs, numOfPages, currentPage }}>
            <SearchContainer />
            <JobsContainer />
        </AllJobsContext.Provider>
    );
};

export default AllJobs;
