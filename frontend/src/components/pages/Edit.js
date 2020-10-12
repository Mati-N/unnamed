import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { UPDATE_USER } from "../../Queries";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { alertAtom } from "../../atoms";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Button from "@material-ui/core/Button";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(4),
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

  input: {
    display: "none",
  },
  button: {
    padding: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  imageButtons: {
    padding: theme.spacing(2),
    display: "flex",
    alignItems: "center",
    gap: "15px",
    justifyContent: "space-evenly",
  },
}));

const Edit = () => {
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const [updateUser] = useMutation(UPDATE_USER);
  const [imageUrl, setImageUrl] = useState(null);
  const classes = useStyles();
  const history = useHistory();
  useEffect(() => {
    removeAlert();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          username: "",
          newPassword: "",
          password: "",
          image: null,
        }}
        validationSchema={Yup.object({
          username: Yup.string().max(30, "Must be 30 characters or less"),
          password: Yup.string()
            .min(8, "Must be 8 characters or more")
            .required("Required"),
          newPassword: Yup.string()
            .min(8, "Must be 8 characters or more")
            .matches(
              /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
              "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
            ),
        })}
        onSubmit={(values, { setSubmitting }) => {
          if (
            values.username == null &&
            image == null &&
            values.newPassword == null
          ) {
            return;
          }
          setSubmitting(true);
          updateUser({
            variables: {
              password: values.password,
              username: values.username.length > 0 ? values.username : null,
              newPassword:
                values.newPassword.length > 0 ? values.newPassword : null,
              image: values.image,
            },
            update: (cache, { data }) => {
              if (cache && data.ok) {
                cache.writeFragment({
                  id: `UserNode:${data.updateUser.user.id}`,
                  fragment: gql`
                    fragment User on UserNode {
                      username
                      imagePath
                    }
                  `,
                  data: {
                    username: data.updateUser.user.username,
                    imagePath: data.updateUser.user.imagePath,
                  },
                });
              }
            },
          }).then((d) => {
            if (d) {
              if (!d.data.updateUser.ok) {
                setAlert({
                  message: d.data.updateUser.message,
                  type: "warning",
                });
              } else {
                setAlert({
                  message: d.data.updateUser.message,
                  type: "warning",
                });

                history.push("/");
              }
            }
          });
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, dirty, setFieldValue }) => (
          <>
            {imageUrl && (
              <img
                alt="profile picture"
                className="mx-auto d-block w-25 h-25"
                src={imageUrl}
              />
            )}
            <Form className={classes.form}>
              <p className={classes.formLabel}>Edit Account</p>

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
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <Field
                  type="password"
                  label="New Password"
                  name="newPassword"
                  as={TextField}
                  fullWidth
                  className={classes.formField}
                />
                <ErrorMessage
                  name="newPassword"
                  component={FormHelperText}
                  error={true}
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <button
                  type="submit"
                  className="btn btn-teal"
                  disabled={isSubmitting || !(isValid && dirty)}
                >
                  Change
                </button>
              </FormControl>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Edit;
