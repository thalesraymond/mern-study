import { redirect, type ActionFunctionArgs } from "react-router-dom";
import apiClient from "../../utils/ApiClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const addJobAction = async ({ request, params }: ActionFunctionArgs) => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        toast.info("This feature is disabled in explore mode");
        return null;
    }

    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const jobId = params.jobId;

    try {
        if (jobId) {
            await apiClient.put(`/jobs/${jobId}`, data);

            toast.success("Job updated successfully");
        } else {
            await apiClient.post("/jobs", data);

            toast.success("Job added successfully");
        }

        return redirect("/dashboard/all-jobs");
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg);

        return null;
    }
};

export default addJobAction;
