import { redirect, type ActionFunctionArgs } from "react-router-dom";
import apiClient from "../../utils/ApiClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const deleteJobAction = async ({ params }: ActionFunctionArgs) => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        toast.info("This feature is disabled in explore mode");
        return redirect("/dashboard/all-jobs");
    }

    const jobId = params.jobId;

    try {
        await apiClient.delete(`/jobs/${jobId}`);

        toast.success("Job deleted successfully");
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg ?? "Could not delete the job");
    }

    return redirect("/dashboard/all-jobs");
};

export default deleteJobAction;
