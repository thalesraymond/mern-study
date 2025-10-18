import { toast } from "react-toastify";
import apiClient from "../../utils/ApiClient";
import type { AxiosError } from "axios";

const allJobsLoader = async () => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        return {
            jobs: [
                {
                    id: "1",
                    company: "Dummy Company 1",
                    position: "Dummy Position 1",
                    status: "pending",
                    jobType: "full-time",
                    location: "Dummy Location 1",
                    createdAt: new Date().toISOString(),
                },
                {
                    id: "2",
                    company: "Dummy Company 2",
                    position: "Dummy Position 2",
                    status: "interview",
                    jobType: "part-time",
                    location: "Dummy Location 2",
                    createdAt: new Date().toISOString(),
                },
            ],
            totalJobs: 2,
            numOfPages: 1,
            currentPage: 1,
        };
    }

    try {
        const { data } = await apiClient.get("/jobs");

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg ?? "Invalid session, please log in");

        return error;
    }
};

export default allJobsLoader;
