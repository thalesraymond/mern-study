import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // This object contains configuration for the Vite dev server.
        proxy: {
            // This sets up proxy rules.
            "/api": {
                // This rule applies to any request path that starts with "/api".
                // For example: /api/v1/jobs, /api/v1/auth/login, etc.

                // The target is your backend server's address.
                // Any request matching "/api" will be forwarded to http://localhost:5100.
                target: process.env.VITE_API_URL || "http://localhost:5100/api",

                // This is crucial for virtual-hosted sites. It changes the 'Origin'
                // header of the request to match the target's origin. This makes
                // the backend server believe the request is coming from the same
                // origin, which is often required for security reasons.
                changeOrigin: true,

                // This function rewrites the request path before sending it to the target.
                // It removes the "/api" prefix from the path.
                // For example, a frontend request to "/api/v1/jobs" becomes "/v1/jobs"
                // before being sent to "http://localhost:5100/api".
                // This is to avoid duplicated "api" paths
                rewrite: (path: string) => path.replace(/^\/api/, ""),
            },
        },
    },
});
