import { toast } from "react-toastify";
import apiClient from "../../utils/ApiClient";
import type { AxiosError } from "axios";
import queryClient from "../../queryClient";

export const userQuery = {
    queryKey: ["user"],
    queryFn: async () => {
        const { data } = await apiClient.get("/user");
        return data;
    },
};

const dashboardLoader = async () => {
    const isExplore = localStorage.getItem("isExplore");

    if (isExplore && JSON.parse(isExplore)) {
        return {
            user: {
                name: "Guest User",
                role: "user",
                imageId: "",
            },
        };
    }

    try {
        return await queryClient.ensureQueryData(userQuery);
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;

        toast.error(axiosError?.response?.data?.msg ?? "Invalid session, please log in");

        return error;
    }
};

export default dashboardLoader;
