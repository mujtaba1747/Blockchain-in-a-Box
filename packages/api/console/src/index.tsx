import React from "react";
import ReactDOM from "react-dom";
import { ConnectedRouter } from "connected-react-router";
import App from "./App";
import { ThemeProvider } from "@material-ui/core";
import { defaultTheme } from "./utilities/MuiThemes";
import { Provider } from "react-redux";
import store, { history } from "./redux/Store";
import "./index.css";

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <ThemeProvider theme={defaultTheme}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </ThemeProvider>
    </Provider>,
    document.getElementById("root")
  );
};

render();

declare global {
  interface Window {
    Store: any;
  }
}

window.Store = store;
