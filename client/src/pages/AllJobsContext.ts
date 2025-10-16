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
});

export const useAllJobsContext = () => useContext(AllJobsContext);

export default AllJobsContext;
