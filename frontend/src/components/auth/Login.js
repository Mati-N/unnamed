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
import { LOGIN_USER } from "../../Queries";
import Cookies from "js-cookie";

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

function Login() {
  const setAuth = useSetRecoilState(authAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const classes = useStyles();
  const [login] = useMutation(LOGIN_USER);

  useEffect(() => {
    removeAlert();
  }, []);

  const doLogin = (username, password) => {
    login({
      variables: {
        username,
        password,
      },
    })
      .catch((error) => setAlert({ message: error.message, type: "warning" }))
      .then((d) => {
        if (d) {
          if (d.data.tokenAuth !== null) {
            removeAlert();
            Cookies.set("token", d.data.tokenAuth.token);
            Cookies.set("USER-ID", d.data.tokenAuth.user.id);
            Cookies.set("refresh-token", d.data.tokenAuth.refreshToken);
            setAuth((oldAuth) => ({
              ...oldAuth,
              token: d.data.tokenAuth.token,
              user: d.data.tokenAuth.user.id,
              refreshToken: d.data.tokenAuth.refreshToken,
              isAuthenticated: true,
            }));
          }
        }
      });
  };

  return (
    <>
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
          doLogin(values.username, values.password);
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
                  type="text"
                  name="username"
                  as={TextField}
                  label="Username"
                  className={classes.formField}
                  fullWidth
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
