import React, { useState, useContext, useEffect, lazy } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POSTS } from "../../Queries";
import AlertContext from "../../context/alert/AlertContext";
const { Redirect } = lazy(() => import("react-router-dom"));

const NewPost = () => {
  const [state, setState] = useState({ title: "", content: "" });
  const [disabled, setDisabled] = useState(true);
  const [sent, setSent] = useState(false);
  const [addPost] = useMutation(CREATE_POST);
  const { setAlert, removeAlert } = useContext(AlertContext);

  const onChange = (e) => {
    let name = e.target.name;
    setState({ ...state, [name]: e.target.value });
    switch (name) {
      case "title":
        if (e.target.value.length < 1) {
          setAlert("Title too short", "warning");
          setDisabled(true);
        } else if (e.target.value.length > 260) {
          setAlert("Title too long", "warning");
          setState({ ...state, title: state.title.substring(0, 260) });
          setDisabled(true);
        } else if (state.content.length > 0 && state.content.length <= 5500) {
          removeAlert();
          setDisabled(false);
        }
      case "content":
        if (e.target.value.length < 1) {
          setAlert("Content too short", "warning");
          setDisabled(true);
        } else if (e.target.value.length > 5500) {
          setAlert("Content too long", "warning");
          setState({ ...state, content: state.content.substring(0, 5500) });
          setDisabled(true);
        } else if (state.title.length > 0 && state.title.length <= 260) {
          removeAlert();
          setDisabled(false);
        }
    }
  };

  useEffect(() => {
    removeAlert();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    addPost({
      variables: { title: state.title, text: state.content },
      update: (cache, { data }) => {
        if (cache) {
          let { posts } = cache.readQuery({ query: GET_POSTS });
          console.log(posts);
          const newData = {
            ...posts,
            edges: [
              {
                __typename: "PostNodeEdge",
                node: data.createPost.post,
              },
              ...posts.edges,
            ],
          };
          cache.writeQuery({
            query: GET_POSTS,
            data: {
              posts: newData,
            },
          });
        }
      },
    })
      .catch((e) => console.log(e))
      .then((data) => {
        if (data) {
          if (data !== null && data.data.createPost.ok) {
            setAlert("Post Sent", "primary");
            setSent(true);
          } else {
            setAlert("Something went wrong", "warning");
          }
        }
      });
  };

  if (sent) return <Redirect to="/" />;

  return (
    <div className="main">
      <form onSubmit={onSubmit} method="post" className="form-auth">
        <div className="form-group">
          <label className="label-hide" htmlFor="title">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            name="title"
            placeholder="Title"
            aria-describedby="emailHelp"
            value={state.title}
            onChange={onChange}
            name="title"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            name="content"
            value={state.text}
            className="form-control"
            name="content"
            rows="3"
            onChange={onChange}
            id="content"
          ></textarea>
        </div>
        <button disabled={disabled} type="submit" className="btn btn-teal">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewPost;
