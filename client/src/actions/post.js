import axios from "axios";
import { setAlert } from "./alert";
import { GET_POSTS, POST_ERROR, UPDATE_LIKES } from "./types";

// Get posts
export const getPosts = () => async (dispatch) => {
  try {
    const res = await axios.get("./api/posts");

    dispatch({
      type: GET_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusTest,
        status: err.response.status,
      },
    });
  }
};

// Add like
export const likePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`./api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusTest,
        status: err.response.status,
      },
    });
  }
};
