import { redirect, type ActionFunctionArgs } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const loginAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const formFields = Object.fromEntries(formData);

    try {
        await apiClient.post("/auth/login", formFields);

        toast.success("Welcome!");

        return redirect("/dashboard");
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;
        toast.error(axiosError?.response?.data?.msg ?? "Something went wrong");
        return error;
    }
};

export default loginAction;
