import { toast } from "react-toastify";
import customFetch from "../../utils/ApiClient";
import type { ActionFunctionArgs } from "react-router-dom";

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const file = formData.get("avatar") as File;
    if (file && file.size > 2000000) {
        toast.error("Image size too large");
        return null;
    }

    try {
        await customFetch.patch("/user", formData);
        toast.success("Profile updated successfully");
    } catch (error: any) {
        toast.error(error?.response?.data?.msg);
    }
    return null;
};
