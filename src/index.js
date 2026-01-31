import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import registerServiceWorker from "./registerServiceWorker";

import motherJonesData from "./reducers/motherJonesMassShootings.reducer";



const store = createStore(
  combineReducers({ motherJonesData }),
  applyMiddleware(thunk)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
