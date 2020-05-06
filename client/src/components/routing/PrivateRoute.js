import React from "react";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// If the user is logged in, go on and display the component in question; otherwise, redirect the user to log in page --> const PrivateRoute accepts props as argument. Props is beeing deconstructured. component: Component brings in the component in question, in our case Dashboard, we also (by default I think) have to accept everything else that is passed into it - hence the ...rest operator. also it takes in state.auth which is maped to props by const mapStateToProps
const PrivateRoute = ({
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) =>
      !isAuthenticated && !loading ? (
        <Redirect to="/login" />
      ) : (
        <Component {...props} />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
