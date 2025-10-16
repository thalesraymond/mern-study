import type { ActionFunctionArgs } from "react-router-dom";
import apiClient from "../utils/ApiClient";

const jobLoader = async ({ params }: ActionFunctionArgs) => {
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
