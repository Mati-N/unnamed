import React, { useEffect } from "react";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { authAtom, alertAtom } from "../../atoms";
import LoginSvg from "../SVG/Login.svg";
import { useMutation } from "@apollo/client";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import * as Yup from "yup";
// Import LOGIN_USER from the new AuthQueries.js
import { LOGIN_USER } from "../../AuthQueries"; 
// import Cookies from "js-cookie"; // Cookies are no longer used for auth

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(2),
    width: "80%", // Fix IE 11 issue.
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

function Login(props) { // Added props for history
  const setAuth = useSetRecoilState(authAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const classes = useStyles();
  // Ensure this uses LOGIN_USER from AuthQueries.js
  const [loginMutation] = useMutation(LOGIN_USER); 

  useEffect(() => {
    removeAlert();
  }, [removeAlert]); // Added removeAlert to dependency array

  // Updated doLogin function
  const doLogin = (email, password) => {
    removeAlert();
    loginMutation({ // Use the new mutation hook
      variables: {
        // Variables structure based on AuthQueries.js LOGIN_USER
        email,
        password,
      },
    })
    .then(({ data }) => {
      if (data && data.login && data.login.token) {
        removeAlert();
        localStorage.setItem("token", data.login.token);
        // Optionally store user details if needed globally beyond authAtom
        // localStorage.setItem("user", JSON.stringify(data.login.user));
        setAuth({ // Updated Recoil state
          token: data.login.token,
          user: data.login.user, 
          isAuthenticated: true,
        });
        // Redirect to home page after successful login
        if (props.history) {
            props.history.push("/");
        } else {
            console.warn("props.history not available for redirection.");
            // window.location.href = "/"; // Fallback redirection
        }
      } else {
        setAlert({ message: "Login failed. Please check your credentials.", type: "warning" });
      }
    })
    .catch((error) => {
      console.error("Login error:", error);
      const message = error.graphQLErrors && error.graphQLErrors.length > 0 
                      ? error.graphQLErrors[0].message 
                      : error.message || "An error occurred during login.";
      setAlert({ message, type: "error" });
    });
  };

  return (
    <>
      <Formik
        initialValues={{ email: "", password: "" }} // Changed username to email
        validationSchema={Yup.object({
          email: Yup.string() // Changed username to email
            .email("Invalid email address") // Added email validation
            .required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters long.")
            .required("Required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          doLogin(values.email, values.password); // Pass email instead of username
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, dirty }) => (
          <>
            <Form className={classes.form}>
              <LoginSvg className="w-50 h-50 mx-auto d-block" />
              <p className={classes.formLabel}>Login</p>

              <FormControl className={classes.formControl} fullWidth>
                <Field
                  type="email" // Changed type to email
                  name="email" // Changed name to email
                  as={TextField}
                  label="Email" // Changed label to Email
                  className={classes.formField}
                  fullWidth
                />
                <ErrorMessage
                  name="email" // Changed name to email
                  component={FormHelperText}
                  error={true}
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <Field
                  type="password"
                  label="Password"
                  name="password"
                  as={TextField}
                  fullWidth
                  className={classes.formField}
                />
                <ErrorMessage
                  name="password"
                  component={FormHelperText}
                  error={true}
                  htmlFor="password"
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <button
                  type="submit"
                  className="btn btn-teal"
                  disabled={isSubmitting || !(isValid && dirty)}
                >
                  Login
                </button>
              </FormControl>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}

export default Login;
