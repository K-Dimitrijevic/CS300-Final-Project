import { NavLink } from "react-router-dom";
import Button from "../components/Button";

const NotFound = () => (
  <div className="page center">
    <h1>404</h1>
    <p>The page you are looking for does not exist.</p>
    <NavLink to="/">
      <Button>Return home</Button>
    </NavLink>
  </div>
);

export default NotFound;
