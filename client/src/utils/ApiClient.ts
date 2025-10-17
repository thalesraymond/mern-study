import axios from "axios";

const apiClient = axios.create({
    baseURL: "/api/v1",
});

// Add a global response interceptor
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Check if it's a 403 error
        if (error.response && error.response.status === 403) {
            window.location.href = "/";

            return;
        }

        // Always reject so individual calls can handle other errors
        return Promise.reject(error);
    }
);

export default apiClient;
