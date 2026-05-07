const TextAreaField = ({ label, value, onChange, placeholder, helper }) => (
  <label className="field">
    <span>{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={8}
    />
    {helper && <small>{helper}</small>}
  </label>
);

export default TextAreaField;
