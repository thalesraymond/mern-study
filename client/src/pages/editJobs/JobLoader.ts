import type { ActionFunctionArgs } from "react-router-dom";
import apiClient from "../../utils/ApiClient";

const jobLoader = async ({ params }: ActionFunctionArgs) => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        return {
            id: "1",
            company: "Dummy Company",
            position: "Dummy Position",
            status: "pending",
            jobType: "full-time",
            location: "Dummy Location",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: "guest",
        };
    }

    if (!params.jobId) return null;

    const {
        data,
    }: {
        data: {
            job: {
                id: string;
                company: string;
                position: string;
                status: string;
                jobType: string;
                location: string;
                createdAt: string;
                updatedAt: string;
                createdBy: string;
            };
        };
    } = await apiClient.get(`/jobs/${params.jobId}`);

    return data.job;
};

export default jobLoader;
