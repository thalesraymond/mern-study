const FormRowSelect = (options: { name: string; labelText?: string; defaultValue?: string; list: string[] }) => {
    return (
        <div className="form-row">
            <label htmlFor={options.name} className="form-label">
                {options.labelText || options.name}
            </label>
            <select name={options.name} id={options.name} className="form-select" defaultValue={options.defaultValue}>
                {options.list.map((itemValue) => {
                    return (
                        <option key={itemValue} value={itemValue}>
                            {itemValue}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};
export default FormRowSelect;
