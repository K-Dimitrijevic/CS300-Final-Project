const FileUpload = ({ label, accept, onFile }) => (
  <label className="field">
    <span>{label}</span>
    <input
      type="file"
      accept={accept}
      onChange={(event) => onFile(event.target.files?.[0] || null)}
    />
  </label>
);

export default FileUpload;
