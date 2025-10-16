import { toast } from "react-toastify";
import apiClient from "../../utils/ApiClient";
import type { AxiosError } from "axios";

const allJobsLoader = async () => {
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
