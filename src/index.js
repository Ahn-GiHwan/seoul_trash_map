import React from "react";
import ReactDOM from "react-dom";

import Router from "./Routes";
import Reducer from "./Reducers";
import GlobalStyles from "./Components/GlobalStyled";

import { Provider } from "react-redux";
import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
// import * as serviceWorker from "./serviceWorker.js";
import reportWebVitals from "./reportWebVitals";

const store = createStore(Reducer, composeWithDevTools());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router />
      <GlobalStyles />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

reportWebVitals();
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered", registration);
        registration.pushManager.subscribe({ userVisibleOnly: true });
        Notification.requestPermission().then((p) => {
          console.log(p);
        });
      })
      .catch((e) => {
        console.log("SW registration failed: ", e);
      });
  });
}

// serviceWorker.register();
