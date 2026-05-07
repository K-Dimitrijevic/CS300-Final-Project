const LoadingSpinner = ({ label = "Loading" }) => (
  <div className="spinner" role="status" aria-live="polite">
    <div className="spinner__circle" />
    <span>{label}...</span>
  </div>
);

export default LoadingSpinner;
