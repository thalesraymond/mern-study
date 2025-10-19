import apiClient from "../../utils/ApiClient";
import queryClient from "../../queryClient";

export const statsQuery = {
    queryKey: ['stats'],
    queryFn: async () => {
        const response = await apiClient.get("/jobs/stats");
        return response.data;
    },
};
const jobStatsLoader = async () => {
    try {
        return await queryClient.ensureQueryData(statsQuery);
    } catch (error) {
        return error;
    }
};

export default jobStatsLoader;
