import { useNavigation } from "react-router-dom";

const SubmitButton = (options: { text:string, submittingText: string }) => {
    const navigation = useNavigation();

    const isSubmitting = navigation.state === "submitting";

    return (
        <button
            type="submit"
            className="btn btn-block"
            disabled={isSubmitting}
        >
            {isSubmitting ? options.submittingText : options.text }
        </button>
    );
};

export default SubmitButton;
