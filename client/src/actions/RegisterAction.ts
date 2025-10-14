import { redirect, type ActionFunctionArgs } from "react-router-dom";
import apiClient from "../utils/ApiClient";

const registerAction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const formFields = Object.fromEntries(formData);

    console.log(formFields);

    try {
        await apiClient.post("/register", formFields);

        return redirect("/login");
    } catch (error) {
        return error;
    }
};

export default registerAction;
