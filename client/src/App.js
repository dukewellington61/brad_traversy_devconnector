import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Alert from "./components/layout/Alert";
// Redux
import { Provider } from "react-redux";
import store from "./store";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";
import "./App.css";

// if there is a token in local storage it is beeing set to the header of the axios - request
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // useEffect hook calls loadUser whenever App.js is loaded (for example everytime the page in browser is beeing reloaded)
  useEffect(() => {
    store.dispatch(loadUser());
  }, []); /* empty array as second parameter makes the hook run only once - when it is loaded/mounted --> without [] hook runs whenever state updates as kind of an endless loop */

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
