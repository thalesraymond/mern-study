import { toast } from "react-toastify";
import apiClient from "../../utils/ApiClient";
import type { AxiosError } from "axios";

const dashboardLoader = async () => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        return {
            user: {
                name: "Guest User",
                role: "guest",
                imageId: "",
            },
        };
    }

    try {
        const { data } = await apiClient.get("/user");

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg ?? "Invalid session, please log in");

        return error;
    }
};

export default dashboardLoader;
