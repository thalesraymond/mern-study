import { redirect, type ActionFunctionArgs } from "react-router-dom";
import apiClient from "../utils/ApiClient";
import { toast } from "react-toastify";
import type { AxiosError } from "axios";

const registerAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const formFields = Object.fromEntries(formData);

    console.log(formFields);

    try {
        await apiClient.post("/register", formFields);

        toast.success("User registered successfully");

        return redirect("/login");
    } catch (error) {
        const axiosError = error as AxiosError<{ msg: string }>;
        toast.error(axiosError?.response?.data?.msg ?? "Something went wrong");
        return error;
    }
};

export default registerAction;
