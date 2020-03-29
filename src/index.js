import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import * as serviceWorker from './serviceWorker';

// Get rid of warning created by third party library
// Waiting on this issue resolution: https://github.com/google-map-react/google-map-react/issues/783
const originalWarn = console.warn.bind(console.warn);
console.warn = (msg) =>!msg.toString().includes(
  'Warning: componentWillReceiveProps has been renamed, and is not recommended'
) && originalWarn(msg);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
