const Select = (props) => {
  return (
    <div>
      <select
        className="form-select my-3"
        aria-label="Default select example"
        name={props.name}
        id={props.name}
        onChange={props.onChange}
        value={props.value}
        isSearchable
        disabled={props.disabled}
      >
        <option value="">{props.default}</option>
        {props.options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
