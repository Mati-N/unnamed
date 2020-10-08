import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/auth/AuthContext";
import AlertContext from "../../context/alert/AlertContext";
import { Formik, Field, ErrorMessage, Form } from "formik";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import * as Yup from "yup";
import SignUp from "../SVG/Signup.svg";

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
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Register() {
  const Auth = useContext(AuthContext);
  const { removeAlert } = useContext(AlertContext);
  const classes = useStyles();
  useEffect(() => {
    removeAlert();
  }, []);

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(30, "Must be 30 characters or less")

          .required("Required"),
        password: Yup.string()
          .min(8, "Must be 8 characters or more")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        Auth.doRegister(values.username, values.password);
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
                disabled={isSubmitting || !isValid || !dirty}
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
