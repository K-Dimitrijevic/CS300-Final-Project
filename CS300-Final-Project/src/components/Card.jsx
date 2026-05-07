const Card = ({ title, subtitle, children, variant = "default" }) => (
  <section className={`card card--${variant}`}>
    {(title || subtitle) && (
      <header className="card__header">
        {title && <h3>{title}</h3>}
        {subtitle && <p>{subtitle}</p>}
      </header>
    )}
    <div className="card__body">{children}</div>
  </section>
);

export default Card;
