import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMutation, useQuery, gql } from "@apollo/client";
import { UPDATE_USER, SELF_USER } from "../../Queries";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { alertAtom } from "../../atoms";
import { Formik, Field, ErrorMessage, Form } from "formik";
import Button from "@material-ui/core/Button";
import {
  TextField,
  FormControl,
  makeStyles,
  FormHelperText,
  CircularProgress,
} from "@material-ui/core";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import CloseIcon from "@material-ui/icons/Close";
import * as Yup from "yup";

const useStyles = makeStyles((theme) => ({
  form: {
    marginTop: theme.spacing(4),
    width: "80%",
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
  const classes = useStyles();
  const history = useHistory();
  const setAlert = useSetRecoilState(alertAtom);
  const removeAlert = useResetRecoilState(alertAtom);
  const [updateUser] = useMutation(UPDATE_USER);
  const { data: selfData, loading: selfLoading, error: selfError } = useQuery(SELF_USER);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    removeAlert();
  }, []);

  useEffect(() => {
    if (selfData?.selfUser?.imagePath && !imageUrl) {
      setImageUrl(selfData.selfUser.imagePath);
    }
  }, [selfData, imageUrl]);

  if (selfLoading && !selfData)
    return (
      <div className="spinner">
        <CircularProgress />
      </div>
    );

  if (selfError) {
    return <p className="text-danger">Unable to load your profile details. Please refresh.</p>;
  }

  const currentUser = selfData?.selfUser;

  return (
    <Formik
      enableReinitialize
      initialValues={{
        username: currentUser?.username || "",
        newPassword: "",
        password: "",
        image: null,
        bio: currentUser?.bio || "",
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
            "Must contain 8 characters, an uppercase letter, lowercase letter, number and special character"
          ),
        bio: Yup.string().max(500, "Must be 500 characters or less"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        const trimmedUsername = values.username.trim();
        const trimmedBio = values.bio.trim();
        const usernameChanged =
          trimmedUsername && trimmedUsername !== (currentUser?.username || "");
        const bioChanged = trimmedBio !== (currentUser?.bio || "");
        const imageChanged = Boolean(values.image);
        const passwordChanged = values.newPassword.length > 0;

        if (!usernameChanged && !bioChanged && !imageChanged && !passwordChanged) {
          setAlert({ message: "There's nothing to update.", type: "warning" });
          setSubmitting(false);
          return;
        }

        updateUser({
          variables: {
            password: values.password,
            username: usernameChanged ? trimmedUsername : null,
            newPassword: passwordChanged ? values.newPassword : null,
            image: values.image,
            bio: bioChanged ? trimmedBio : null,
          },
          update: (cache, { data }) => {
            const updated = data?.updateUser?.user;
            if (!cache || !updated) {
              return;
            }

            cache.writeFragment({
              id: `UserNode:${updated.id}`,
              fragment: gql`
                fragment EditableUser on UserNode {
                  username
                  imagePath
                  bio
                }
              `,
              data: {
                username: updated.username,
                imagePath: updated.imagePath,
                bio: updated.bio,
              },
            });
          },
        })
          .then((response) => {
            const payload = response?.data?.updateUser;
            if (!payload) {
              setAlert({ message: "Something went wrong", type: "warning" });
              return;
            }

            if (!payload.ok) {
              setAlert({ message: payload.message || "Unable to update account", type: "warning" });
            } else {
              setAlert({ message: payload.message || "Account updated", type: "success" });
              if (payload.user?.imagePath) {
                setImageUrl(payload.user.imagePath);
              }
              history.push("/account");
            }
          })
          .catch((error) => {
            setAlert({ message: error.message, type: "warning" });
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({ isSubmitting, isValid, dirty, setFieldValue, values }) => (
        <Form className={classes.form}>
          <p className={classes.formLabel}>Edit Account</p>

          {imageUrl && (
            <img alt="profile" className="mx-auto d-block w-25 h-25" src={imageUrl} />
          )}

          <FormControl className={classes.formControl} fullWidth>
            <input
              accept="image/*"
              className={classes.input}
              id="icon-button-file"
              type="file"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) {
                  return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                  setFieldValue("image", file);
                  setImageUrl(reader.result);
                };
                reader.readAsDataURL(file);
              }}
            />
            <label htmlFor="icon-button-file" className={classes.imageButtons}>
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
                    setImageUrl(currentUser?.imagePath || null);
                    setFieldValue("image", null);
                  }}
                >
                  Reset Picture
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
            <ErrorMessage name="username" component={FormHelperText} error />
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
            <ErrorMessage name="password" component={FormHelperText} error />
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
            <ErrorMessage name="newPassword" component={FormHelperText} error />
          </FormControl>

          <FormControl className={classes.formControl} fullWidth>
            <Field
              type="text"
              label="Bio"
              name="bio"
              as={TextField}
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              className={classes.formField}
              helperText={`${values.bio.length}/500 characters`}
            />
            <ErrorMessage name="bio" component={FormHelperText} error />
          </FormControl>

          <FormControl className={classes.formControl} fullWidth>
            <button
              type="submit"
              className="btn btn-teal"
              disabled={isSubmitting || !(isValid && dirty)}
            >
              {isSubmitting ? "Updating..." : "Change"}
            </button>
          </FormControl>
        </Form>
      )}
    </Formik>
  );
};

export default Edit;
