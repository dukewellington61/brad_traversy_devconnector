import axios from "axios";
import { setAlert } from "./alert";
import {
  GET_POSTS,
  ADD_POST,
  POST_ERROR,
  UPDATE_LIKES,
  DELETE_POST,
} from "./types";

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

// Add Post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("./api/posts", formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert("Post Created", "success"));
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

// Delete Post
export const deletePost = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`./api/posts/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
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
export const addLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`./api/posts/like/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: res.data,
      } /* id = post.id , 
      res.data = array of like objects which have _id and user id */,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusTest,
        status: err.response.status,
      },
    });
  }
};

// Remove like
export const removeLike = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`./api/posts/unlike/${id}`);

    dispatch({
      type: UPDATE_LIKES,
      payload: {
        id,
        likes: res.data,
      } /* id = post.id , 
      res.data = array of like objects which have _id and user id */,
    });
  } catch (err) {
    dispatch(setAlert(err.response.data.msg, "danger"));

    dispatch({
      type: POST_ERROR,
      payload: {
        msg: err.response.statusTest,
        status: err.response.status,
      },
    });
  }
};
