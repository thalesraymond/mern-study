import { useNavigation } from "react-router-dom";

const SubmitButton = (options: { text: string; submittingText: string; aditionalCssClasses?: string }) => {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    return (
        <button
            type="submit"
            className={`btn form-btn btn-block ${options.aditionalCssClasses || ""}`}
            disabled={isSubmitting}
        >
            {isSubmitting ? options.submittingText : options.text}
        </button>
    );
};

export default SubmitButton;
