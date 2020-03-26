import React from "react";
import { createClient, Provider } from 'urql';

import DataPage from "../DataPage";
import "./App.scss";

const client = createClient({
  url: 'https://hasura-test-manufacturers-db.herokuapp.com/v1/graphql',
});

function App() {
  return (
    <Provider value={client}>
      <DataPage />
    </Provider>
  );
};

export default App;
