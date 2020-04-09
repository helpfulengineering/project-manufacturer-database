import React, {useEffect, useState} from "react";
import { createClient, Provider } from 'urql';
import jwt_decode from 'jwt-decode';

import DataPage from "../DataPage";
import "./App.scss";
import {GRAPHQL_ENDPOINT, ROLES} from "../../config";
import {useAuth0} from "../../auth/react-auth0-spa";
import NavBar from "../../components/NavBar";
import {Container, Paper} from "@material-ui/core";
import HELogo from "../../assets/helpfulengineering_transparent.png";
import Typography from "@material-ui/core/Typography";

const createUrqlClient = (role, token) => {
  // Adding token to requests, bit of work because we can't use an async function for fetchOptions. The function must be synchronous.
  return createClient({
    url: GRAPHQL_ENDPOINT,
    fetchOptions: () => {
      if (role && token) {
        return {
          headers: {
            authorization: `Bearer ${token}`,
            'X-Hasura-Role': role
          }
        };
      }
      return {};
    },
  });
};
export const RoleContext = React.createContext(undefined);

function App() {
  const { loading: authLoading, getTokenSilently, isAuthenticated } = useAuth0();
  const [ urqlClient, setUrqlClient ] = useState(createUrqlClient());
  const [role, setRole] = useState();

  useEffect(() => {
    // updated client with token authorization when authentication is loaded.
    if(authLoading === false && isAuthenticated) {
      getTokenSilently().then(token => {
        // Get user roles for authorization
        const decoded = jwt_decode(token);
        const hasuraClaims = decoded['https://hasura.io/jwt/claims'];
        const allowedRoles = hasuraClaims['x-hasura-allowed-roles'];
        const role = allowedRoles.includes(ROLES.USER_MANAGER) ? ROLES.USER_MANAGER : ROLES.USER;
        setRole(role);

        setUrqlClient(createUrqlClient(role, token));
      });
    }
  }, [authLoading, isAuthenticated, getTokenSilently]);

  if (authLoading) {
    // Many auth0 calls will fail until loaded, for example getTokenSilently will fail.
    return <div>Loading authentication...</div>;
  }

  return (
    <Provider value={urqlClient}>
      <RoleContext.Provider value={role}>
        <Container maxWidth="xl">
          <Paper className="app--body">
            <header className="app--header">
              <a href="https://helpfulengineering.odoo.com/" title="Project by Helpful Engineering" className="app--HE-logo">
                <img src={HELogo} width="177" height="75" alt="Helpful Engineering Logo"/>
              </a>
              <Typography variant="h2" className="app--title">
                Manufacturing volunteer search
              </Typography>
              <NavBar className="app--nav"/>
            </header>
            <DataPage />
          </Paper>
        </Container>
      </RoleContext.Provider>
    </Provider>
  );
};

export default App;
