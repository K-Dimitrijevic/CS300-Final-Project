const Button = ({ children, variant = "primary", type = "button", ...props }) => (
  <button className={`button button--${variant}`} type={type} {...props}>
    {children}
  </button>
);

export default Button;
