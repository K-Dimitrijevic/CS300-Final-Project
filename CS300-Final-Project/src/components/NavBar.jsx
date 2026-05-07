import { NavLink } from "react-router-dom";

const NavBar = () => (
  <header className="nav">
    <div className="nav__brand">
      <span className="nav__logo">VizLab</span>
      <span className="nav__tag">Data Studio</span>
    </div>
    <nav className="nav__links">
      <NavLink to="/" end>
        Home
      </NavLink>
      <NavLink to="/input">Data Input</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/saved">Saved Datasets</NavLink>
      <NavLink to="/about">About</NavLink>
    </nav>
  </header>
);

export default NavBar;
