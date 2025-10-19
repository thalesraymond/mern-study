import apiClient from "../utils/ApiClient";

export const profileImageQuery = (imageId: string) => ({
    queryKey: ["profileImage", imageId],
    queryFn: async () => {
        const response = await apiClient.get(`/user/profile-image?id=${imageId}`, {
            responseType: "blob",
        });
        return response.data;
    },
});
