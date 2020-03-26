import React from "react";
import { createClient, Provider } from 'urql';

import DataPage from "../DataPage";
import "./App.scss";
import {GRAPHQL_ENDPOINT} from "../../config";

const client = createClient({
  url: GRAPHQL_ENDPOINT,
});

function App() {
  return (
    <Provider value={client}>
      <DataPage />
    </Provider>
  );
};

export default App;
