const FormRow = (options: {
    type: string;
    name: string;
    labelText?: string;
    defaultValue?: string;
}) => {
    return (
        <div className="form-row">
            <label htmlFor={options.name} className="form-label">
                {options.labelText || options.name}
            </label>
            <input
                type={options.type}
                className="form-input"
                id={options.name}
                defaultValue={options.defaultValue || ""}
                required
            />
        </div>
    );
};

export default FormRow;
