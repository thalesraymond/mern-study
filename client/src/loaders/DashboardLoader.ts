import { toast } from "react-toastify";
import apiClient from "../utils/ApiClient";
import type { AxiosError } from "axios";
import { redirect } from "react-router-dom";

const dashboardLoader = async () => {
    try {
        const { data } = await apiClient.get("/user");

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg ?? "Invalid session, please log in");

        return redirect("/login");
    }
};

export default dashboardLoader;
