import axios from "axios";

// if request has to be send with a token, token from localStorage is beeing added to header of this request
// if request doesn't need a token, header is beeing deleted
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token;
  } else {
    delete axios.defaults.headers.common["x-auth-token"];
  }
};

export default setAuthToken;
