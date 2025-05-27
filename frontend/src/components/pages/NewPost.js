import React, { useEffect } from "react";
import { useMutation } from "@apollo/client";
// Import CREATE_POST_MUTATION and GET_POSTS_SIMPLIFIED from the new PostQueries.js
import { CREATE_POST_MUTATION, GET_POSTS_SIMPLIFIED } from "../../PostQueries"; 
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
    marginTop: theme.spacing(15), // Keep existing margin or adjust as needed
    width: "75%", 
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
  const history = useHistory();
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);

  const [addPostMutation, { error: mutationError }] = useMutation(CREATE_POST_MUTATION, {
    update(cache, { data: { createPost: newPost } }) {
      try {
        // Read the current posts from the cache
        const existingPostsData = cache.readQuery({ query: GET_POSTS_SIMPLIFIED });

        if (existingPostsData && newPost) {
          cache.writeQuery({
            query: GET_POSTS_SIMPLIFIED,
            data: {
              // Assuming GET_POSTS_SIMPLIFIED returns { posts: [...] }
              posts: [newPost, ...existingPostsData.posts], 
            },
          });
        }
      } catch (e) {
        // Cache for GET_POSTS_SIMPLIFIED might not exist yet if user hasn't visited home
        // Or if the structure of newPost doesn't perfectly match what's expected.
        console.error("Error updating cache after creating post:", e);
        // Optionally, inform the user that they might need to refresh to see the new post.
        // setAlert({ message: "Post created! You may need to refresh to see it in all lists.", type: "info" });
      }
    },
    onCompleted: (data) => {
      // The new mutation directly returns the post if successful.
      // The 'ok' field is no longer used for success checking.
      // If 'data.createPost' exists, it was successful.
      if (data && data.createPost) {
        setAlert({ message: "Post Created Successfully!", type: "success" });
        history.push("/"); // Redirect to home page
      } else {
        // This case should ideally be caught by onError or if backend returns partial data without error.
        setAlert({ message: "Something went wrong creating the post.", type: "warning" });
      }
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      const message = error.graphQLErrors && error.graphQLErrors.length > 0 
                      ? error.graphQLErrors[0].message 
                      : error.message || "An error occurred while creating the post.";
      setAlert({ message, type: "error" });
    }
  });

  useEffect(() => {
    removeAlert();
  }, [removeAlert]); // Added removeAlert to dependency array

  // Renamed from onSubmit to avoid confusion with Formik's onSubmit
  const handleCreatePost = (values) => { 
    addPostMutation({
      variables: { 
        title: values.title,
        text: values.content, // Map form field 'content' to mutation variable 'text'
      },
    });
  };

  return (
    <Formik
      initialValues={{ title: "", content: "" }}
      validationSchema={Yup.object({
        title: Yup.string()
          .max(100, "Title must be 100 characters or less") // Adjusted max length
          .required("Required"),
        content: Yup.string()
          .min(10, "Content must be 10 characters or more") // Adjusted min length
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        handleCreatePost(values);
        setSubmitting(false); 
        // setSubmitting(false) might be called too soon if handleCreatePost is async
        // and doesn't await. However, useMutation handles its own loading state.
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
              name="content" // This field will be mapped to 'text' in the mutation variables
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
              disabled={isSubmitting || !isValid || !dirty || !!mutationError} // Disable if mutation is in error state or form invalid
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
