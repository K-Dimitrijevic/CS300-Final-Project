const EmptyState = ({ title, description }) => (
  <div className="empty">
    <h3>{title}</h3>
    {description && <p>{description}</p>}
  </div>
);

export default EmptyState;
