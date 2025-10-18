import type { AxiosError } from "axios";
import apiClient from "../../utils/ApiClient";
import { toast } from "react-toastify";
import { redirect } from "react-router-dom";

const adminStatsLoader = async () => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        return {
            users: 1,
            jobs: 2,
        };
    }

    try {
        const response = await apiClient.get("/user/stats");

        return response.data as { users: number; jobs: number };
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError.response?.data.msg || axiosError.message);

        return redirect("/dashboard");
    }
};

export default adminStatsLoader;
