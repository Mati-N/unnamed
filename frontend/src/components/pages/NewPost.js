import React, { useContext, useEffect } from "react";
import { useMutation } from "@apollo/client";
import {
  CREATE_POST,
  GET_POSTS,
  FOLLOWING_POSTS,
  SELF_POSTS,
} from "../../Queries";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { alertAtom } from "../../atoms";
import { useHistory } from "react-router-dom";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(15),
    width: "75%", // Fix IE 11 issue.
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: "90%",
    },
  },
  formField: {
    padding: "0.2em",
  },
  formControl: {
    margin: "0.1em",
    padding: "0.1em",
  },
  formLabel: {
    margin: "auto",
    width: "auto",
    fontSize: "2.5em",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const NewPost = () => {
  const classes = useStyles();
  const [addPost] = useMutation(CREATE_POST);
  const history = useHistory();
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);

  useEffect(() => {
    removeAlert();
  }, []);

  const onSubmit = (state) => {
    addPost({
      variables: { title: state.title, text: state.content },
      update: (cache, { data }) => {
        if (cache) {
          try {
            let { followingPosts } = cache.readQuery({
              query: FOLLOWING_POSTS,
            });
            if (followingPosts) {
              const newFollowingData = {
                ...followingPosts,
                edges: [
                  {
                    __typename: "PostNodeEdge",
                    node: data.createPost.post,
                  },
                  ...followingPosts.edges,
                ],
              };

              cache.writeQuery({
                query: FOLLOWING_POSTS,
                data: {
                  followingPosts: newFollowingData,
                },
              });
            }
          } catch (e) {}

          try {
            let { posts: all_posts } = cache.readQuery({ query: GET_POSTS });

            if (all_posts) {
              const newPostsData = {
                ...all_posts,
                edges: [
                  {
                    __typename: "PostNodeEdge",
                    node: data.createPost.post,
                  },
                  ...all_posts.edges,
                ],
              };
              cache.writeQuery({
                query: GET_POSTS,
                data: {
                  posts: newPostsData,
                },
              });
            }
          } catch (e) {}

          try {
            let { selfPost } = cache.readQuery({ query: SELF_POSTS });

            if (selfPost) {
              const newSelfData = {
                ...selfPost,
                edges: [
                  {
                    __typename: "PostNodeEdge",
                    node: data.createPost.post,
                  },
                  ...selfPost.edges,
                ],
              };
              cache.writeQuery({
                query: SELF_POSTS,
                data: {
                  selfPost: newSelfData,
                },
              });
            }
          } catch (e) {}
        }
      },
    })
      .catch((e) => console.log(e))
      .then((data) => {
        if (data) {
          if (data !== null && data.data.createPost.ok) {
            setAlert({ message: "Post Sent", type: "success" });
            history.push("/");
          } else {
            setAlert({ message: "Something went wrong", type: "warning" });
          }
        }
      });
  };

  return (
    <Formik
      initialValues={{ title: "", content: "" }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(30, "Must be 30 characters or less")
          .required("Required"),
        content: Yup.string()
          .min(20, "Must be 20 characters or more")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => (
        <Form className={classes.form}>
          <p className={classes.formLabel}>New Post</p>
          <FormControl className={classes.formControl} fullWidth>
            <Field
              type="text"
              name="title"
              as={TextField}
              label="Title"
              className={classes.formField}
              fullWidth
            />
            <ErrorMessage
              name="title"
              component={FormHelperText}
              error={true}
            />
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <Field
              type="text"
              name="content"
              as={TextField}
              label="Content"
              className={classes.formField}
              multiline
              variant="outlined"
              fullWidth
              rows={10}
              rowsMax={35}
            />
            <ErrorMessage
              name="content"
              component={FormHelperText}
              error={true}
            />
          </FormControl>
          <FormControl className={classes.formControl} fullWidth>
            <button
              type="submit"
              className="btn btn-teal"
              disabled={isSubmitting || !isValid || !dirty}
            >
              Submit
            </button>
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default NewPost;
