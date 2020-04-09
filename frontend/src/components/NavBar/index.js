import React, {useContext} from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../../auth/react-auth0-spa";
import { RoleContext } from "../../containers/App";
import './NavBar.scss';

const NavBar = ({className}) => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const role = useContext(RoleContext);

  return (
    <div className={`nav-bar ${className}`}>
      {!isAuthenticated && (
        <Button onClick={() => loginWithRedirect({})} variant="contained" color="primary">Log in</Button>
      )}

      {isAuthenticated &&
        <Button onClick={() => logout()} variant="contained" color="primary">{role}, log out</Button>
      }
    </div>
  );
};

export default NavBar;
