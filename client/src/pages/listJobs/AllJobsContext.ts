import { createContext, useContext } from "react";

const AllJobsContext = createContext({
    jobs: [
        {
            id: "",
            company: "",
            position: "",
            status: "",
            jobType: "",
            location: "",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdBy: "",
        },
    ],
    searchValues: {
        search: "",
        jobStatus: "",
        jobType: "",
        sort: "",
    },
    totalJobs: 0,
    numOfPages: 0,
    currentPage: 0,
});

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobsContext;
