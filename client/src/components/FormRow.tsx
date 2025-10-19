const FormRow = (options: {
    type: string;
    name: string;
    labelText?: string;
    defaultValue?: string;
    required?: boolean;
}) => {
    const isRequired = options.required ?? true;
    return (
        <div className="form-row">
            <label htmlFor={options.name} className="form-label">
                {options.labelText || options.name}
            </label>
            <input
                type={options.type}
                className="form-input"
                id={options.name}
                name={options.name}
                defaultValue={options.defaultValue || ""}
                required={isRequired}
            />
        </div>
    );
};

export default FormRow;
