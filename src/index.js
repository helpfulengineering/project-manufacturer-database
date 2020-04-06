import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Auth0Provider } from "./auth/react-auth0-spa";
import history from "./utils/history.js";
import * as config from './config';
import App from './containers/App';
import './index.css';
import posthog from 'posthog-js';
import {POSTHOG_TOKEN, POSTHOG_API_HOST} from "./config";

const onRedirectCallback = appState => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

// Get rid of warning created by third party library
// Waiting on this issue resolution: https://github.com/google-map-react/google-map-react/issues/783
const originalWarn = console.warn.bind(console.warn);
console.warn = (msg) =>!msg.toString().includes(
  'Warning: componentWillReceiveProps has been renamed, and is not recommended'
) && originalWarn(msg);

ReactDOM.render(
  <Auth0Provider
    domain={config.domain}
    client_id={config.client_id}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    audience={config.apiAudienceIdentifier}
  >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
  posthog.init(POSTHOG_TOKEN, {api_host: POSTHOG_API_HOST});
} else {
  console.log('analytics disabled for localhost');
}
