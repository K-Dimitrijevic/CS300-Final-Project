const SelectField = ({ label, value, onChange, options, helper }) => (
  <label className="field">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {helper && <small>{helper}</small>}
  </label>
);

export default SelectField;
