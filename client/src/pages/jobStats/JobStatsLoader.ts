import apiClient from "../../utils/ApiClient";

const jobStatsLoader = async () => {
    try {
        const response = await apiClient.get("/jobs/stats");
        return response.data;
    } catch (error) {
        return error;
    }
};

export default jobStatsLoader;
