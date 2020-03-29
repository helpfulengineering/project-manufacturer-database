import React, {useEffect, useState} from "react";
import { createClient, Provider } from 'urql';

import DataPage from "../DataPage";
import "./App.scss";
import {GRAPHQL_ENDPOINT} from "../../config";
import {useAuth0} from "../../auth/react-auth0-spa";
import NavBar from "../../components/NavBar";
import {Container, Paper} from "@material-ui/core";

const createUrqlClient = (token) => {
  // Adding token to requests, bit of work because we can't use an async function for fetchOptions. The function must be synchronous.
  return createClient({
    url: GRAPHQL_ENDPOINT,
    fetchOptions: () => {
      if (token) {
        return {
          headers: { authorization: token ? `Bearer ${token}` : '' }
        };
      }
      return {};
    },
  });
};

function App() {
  const { loading: authLoading, getTokenSilently, isAuthenticated } = useAuth0();
  const [ urqlClient, setUrqlClient ] = useState(createUrqlClient());

  useEffect(() => {
    // updated client with token authorization when authentication is loaded.
    if(authLoading === false && isAuthenticated) {
      getTokenSilently().then(token => {
        console.log('setting token');
        setUrqlClient(createUrqlClient(token));
      });
    }
  }, [authLoading, isAuthenticated, getTokenSilently]);

  if (authLoading) {
    // Many auth0 calls will fail until loaded, for example getTokenSilently will fail.
    return <div>Loading authentication...</div>;
  }

  return (
    <Provider value={urqlClient}>
      <Container maxWidth="xl">
        <Paper>
          <header>
            <NavBar />
          </header>
          <DataPage />
        </Paper>
      </Container>
    </Provider>
  );
};

export default App;
