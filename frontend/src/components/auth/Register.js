import React, { useState, useEffect } from "react";
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
import { ADD_USER, LOGIN_USER } from "../../Queries";
import CloseIcon from "@material-ui/icons/Close";
import Button from "@material-ui/core/Button";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import SignUp from "../SVG/Signup.svg";
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

  input: {
    display: "none",
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  button: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },

  imageButtons: {
    padding: theme.spacing(1.5),
    display: "flex",
    alignItems: "center",
    gap: "15px",
    justifyContent: "start",
  },
}));

function Register() {
  const setAuth = useSetRecoilState(authAtom);
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const [imageUrl, setImageUrl] = useState(null);
  const classes = useStyles();
  const [addUser] = useMutation(ADD_USER);
  const [login] = useMutation(LOGIN_USER);
  useEffect(() => {
    removeAlert();
  }, []);

  const doRegister = (username, password, image) => {
    removeAlert();
    addUser({
      variables: {
        username,
        password,
        image,
      },
    })
      .catch((error) => `${error}`)
      .then((d) => {
        if (d.data) {
          if (d.data.createUser.ok) {
            login({
              variables: {
                username,
                password,
              },
            })
              .catch((error) =>
                setAlert({ message: error.message, type: "warning" })
              )
              .then((d) => {
                if (d) {
                  if (d.data.tokenAuth !== null) {
                    removeAlert();
                    dispatch({
                      type: LOGIN,
                      payload: d.data.tokenAuth,
                      refresh: false,
                    });

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
            return true;
          } else {
            setAlert({ message: d.data.createUser.message, type: "warning" });
            return false;
          }
        }
      });
  };

  return (
    <Formik
      initialValues={{ username: "", password: "", image: null }}
      validationSchema={Yup.object({
        username: Yup.string()
          .max(30, "Must be 30 characters or less")

          .required("Required"),
        password: Yup.string()
          .min(8, "Must be 8 characters or more")
          .required("Required")
          .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
          ),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        doRegister(values.username, values.password, values.image);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting, isValid, dirty, setFieldValue }) => (
        <>
          <Form className={classes.form}>
            {imageUrl ? (
              <img
                alt="profile picture"
                className="mx-auto d-block w-25 h-25"
                src={imageUrl}
              />
            ) : (
              <SignUp className="w-50 h-50 mx-auto d-block" />
            )}

            <p className={classes.formLabel}>Register</p>
            <FormControl className={classes.formControl} fullWidth>
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={(e) => {
                  let reader = new FileReader();
                  let file = e.target.files[0];
                  reader.onloadend = () => {
                    setFieldValue("image", file);
                    setImageUrl(reader.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              <label
                htmlFor="icon-button-file"
                className={classes.imageButtons}
              >
                <Button
                  variant="contained"
                  color="secondary"
                  className={classes.button}
                  startIcon={<PhotoCamera />}
                  component="span"
                >
                  Profile Pic
                </Button>

                {imageUrl && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    className={classes.button}
                    startIcon={<CloseIcon />}
                    component="span"
                    onClick={(e) => {
                      e.preventDefault();
                      setImageUrl(null);
                      setFieldValue("image", null);
                    }}
                  >
                    Unload Picture
                  </Button>
                )}
              </label>
            </FormControl>
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
