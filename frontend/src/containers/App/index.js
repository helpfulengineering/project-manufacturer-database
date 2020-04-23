import React, {useEffect, useState} from "react";
import { createClient, Provider } from 'urql';
import jwt_decode from 'jwt-decode';

import TokenContext from '../../auth/tokenContext';
import DataPage from "../DataPage";
import "./App.scss";
import {GRAPHQL_ENDPOINT, ROLES} from "../../config";
import {useAuth0} from "../../auth/react-auth0-spa";
import NavBar from "../../components/NavBar";
import {Container, Paper} from "@material-ui/core";
import HELogo from "../../assets/helpfulengineering_transparent-cropped.png";
import ManucorLogo from "../../assets/manucor_logo-saturated-transparent.png";
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
  const [token, setToken] = useState(undefined);

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
        setToken(token);

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
        <TokenContext.Provider value={token}>
          <Container maxWidth="xl">
            <Paper className="app__body">
              <header className="app__header">
                <a href="https://www.helpfulengineering.org/" title="Project by Helpful Engineering" className="app__logo app__HE-logo">
                  <img src={HELogo} width="396" height="154" alt="Helpful Engineering Logo"/>
                </a>

                <div className="app__logo app__Manucor-logo">
                  <div className="app__Manucor-logo-container">
                    <img src={ManucorLogo} width="424" height="424" alt="Manucor app logo" />
                  </div>
                  <div className="app__Manucor-logo-text">
                    <Typography variant="h4" component="h1" className="app__Manucor-title">Manucor</Typography>
                    <div className="app__Manucor-subtitle">Manufacturing against COVID-19</div>
                  </div>
                </div>

                <NavBar className="app__nav"/>
              </header>
              <DataPage />
            </Paper>
          </Container>
        </TokenContext.Provider>
      </RoleContext.Provider>
    </Provider>
  );
}

export default App;
