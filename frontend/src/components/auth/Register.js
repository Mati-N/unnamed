import React, { useEffect } from "react"; // Removed useState as imageUrl is gone
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { authAtom, alertAtom } from "../../atoms";
import { useMutation } from "@apollo/client";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import * as Yup from "yup";
// Import SIGNUP_USER from the new AuthQueries.js
import { SIGNUP_USER } from "../../AuthQueries"; 
import SignUp from "../SVG/Signup.svg";
// Cookies are no longer used for auth

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(2),
    width: "80%", // Fix IE 11 issue.
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: "90%",
    },
  },
  formControl: {
    margin: "0.1em",
    padding: "0.1em",
  },

  formField: {
    padding: "0.2em",
  },
  formLabel: {
    margin: "auto",
    width: "auto",
    fontSize: "2.5em",
  },

  // input: { // No longer needed for image upload
  //   display: "none",
  // },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  // button: { // No longer needed for image upload
  //   padding: theme.spacing(1),
  //   marginBottom: theme.spacing(1),
  // },

  // imageButtons: { // No longer needed for image upload
  //   padding: theme.spacing(1.5),
  //   display: "flex",
  //   alignItems: "center",
  //   gap: "15px",
  //   justifyContent: "start",
  // },
}));

function Register(props) { // Added props for history.push
  const setAuth = useSetRecoilState(authAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  // const [imageUrl, setImageUrl] = useState(null); // Image upload removed
  const classes = useStyles();
  // Use SIGNUP_USER mutation
  const [signupUserMutation] = useMutation(SIGNUP_USER); 

  useEffect(() => {
    removeAlert();
  }, [removeAlert]); // Added removeAlert to dependency array

  // Updated doRegister function
  const doRegister = (username, email, password) => {
    removeAlert();
    signupUserMutation({ 
      variables: {
        // Variables structure based on AuthQueries.js SIGNUP_USER
        username,
        email,
        password,
      },
    })
    .then(({ data }) => {
      if (data && data.signup && data.signup.token) {
        removeAlert();
        localStorage.setItem("token", data.signup.token);
        // Optionally store user details if needed globally beyond authAtom
        // localStorage.setItem("user", JSON.stringify(data.signup.user)); 
        setAuth({ // Updated Recoil state
          token: data.signup.token,
          user: data.signup.user, 
          isAuthenticated: true,
        });
        // Redirect to home page after successful registration
        if (props.history) {
            props.history.push("/"); 
        } else {
            // Fallback or error if history is not available
            console.warn("props.history not available for redirection.");
            // As a fallback, could try window.location.href, but history is preferred in React Router apps
            // window.location.href = "/"; 
        }
      } else {
        // Handle cases where signup might not return data as expected but doesn't throw GraphQL error
        setAlert({ message: "Registration failed. Please try again.", type: "warning" });
      }
    })
    .catch((error) => {
      console.error("Registration error:", error);
      const message = error.graphQLErrors && error.graphQLErrors.length > 0 
                      ? error.graphQLErrors[0].message 
                      : error.message || "An error occurred during registration.";
      setAlert({ message, type: "error" });
    });
  };

  return (
    <Formik
      initialValues={{ username: "", email: "", password: "" }} 
      validationSchema={Yup.object({
        username: Yup.string()
          .max(30, "Must be 30 characters or less")
          .required("Required"),
        email: Yup.string() 
          .email("Invalid email address")
          .required("Required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters long.")
          .required("Required")
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/, 
            "Password must contain at least 8 chars, one letter, one number."
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        doRegister(values.username, values.email, values.password); 
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, dirty }) => ( 
        <>
          <Form className={classes.form}>
            <SignUp className="w-50 h-50 mx-auto d-block" />
            <p className={classes.formLabel}>Register</p>
            
            <FormControl className={classes.formControl} fullWidth>
              <Field
                type="text"
                name="username"
                as={TextField}
                label="Username"
                fullWidth
                className={classes.formField}
              />
              <ErrorMessage
                name="username"
                component={FormHelperText}
                error={true}
              />
            </FormControl>

            <FormControl className={classes.formControl} fullWidth>
              <Field
                type="email"
                name="email"
                as={TextField}
                label="Email"
                fullWidth
                className={classes.formField}
              />
              <ErrorMessage
                name="email"
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
                Register
              </button>
            </FormControl>
          </Form>
        </>
      )}
    </Formik>
  );
}

export default Register;
