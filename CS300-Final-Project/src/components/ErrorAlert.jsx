const ErrorAlert = ({ message }) => (
  <div className="alert alert--error" role="alert">
    <strong>Heads up:</strong> {message}
  </div>
);

export default ErrorAlert;
