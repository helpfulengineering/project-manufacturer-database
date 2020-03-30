import React, {useContext} from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../../auth/react-auth0-spa";
import './NavBar.scss';
import {RoleContext} from "../../containers/App";

const AUTH_LOADING_LABEL = 'Waiting for authentication/authorization';

const NavBar = () => {
  const { loading: authLoading, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const role = useContext(RoleContext);

  return (
    <div className="nav-bar">
      {!isAuthenticated && (
        <Button onClick={() => loginWithRedirect({})} variant="contained" color="primary">Log in</Button>
      )}

      {isAuthenticated && <Button onClick={() => logout()} variant="contained" color="primary">Log out</Button>}

      { authLoading && <div>{AUTH_LOADING_LABEL}</div> }

      <div>
        Work in progress. <b>not all data is imported yet!</b>
      </div>

      <div>Is authenticated: {isAuthenticated ? `true with role: ${role}` : 'false'}</div>
    </div>
  );
};

export default NavBar;
