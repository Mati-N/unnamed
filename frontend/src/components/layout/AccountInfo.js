import React, { useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Cookies from "js-cookie";
import { useMutation } from "@apollo/client";
import { useRecoilState } from "recoil";
import { LOGOUT_LOGGED_OUT, LOGOUT_USER } from "../../Queries";
import { authAtom } from "../../atoms";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
    position: "relative",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: theme.spacing(2),
  },
  profile: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    minWidth: 0,
  },
  avatar: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    fontSize: "1.75rem",
  },
  bio: {
    marginTop: theme.spacing(1),
    maxWidth: "60ch",
  },
  stats: {
    display: "flex",
    gap: theme.spacing(1.5),
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  },
  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing(3),
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
  },
  subtitle: {
    color: theme.palette.text.secondary,
  },
}));

const AccountInfo = ({ user_data }) => {
  const classes = useStyles();
  const [auth, setAuth] = useRecoilState(authAtom);
  const [logout] = useMutation(LOGOUT_USER);
  const [logoutLoggedOut] = useMutation(LOGOUT_LOGGED_OUT);
  const [isProcessing, setIsProcessing] = useState(false);

  const { selfUser } = user_data;

  const clearSession = () => {
    Cookies.remove("token");
    Cookies.remove("refresh-token");
    Cookies.remove("USER-ID");
    logoutLoggedOut().catch(() => undefined);
    setAuth({ isAuthenticated: false, token: null, refreshToken: null, user: null });
  };

  const handleLogout = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    const refreshToken = auth?.refreshToken;
    const logoutPromise = refreshToken
      ? logout({ variables: { token: refreshToken } })
      : Promise.resolve();

    logoutPromise
      .catch(() => undefined)
      .finally(() => {
        clearSession();
        setIsProcessing(false);
      });
  };

  return (
    <Paper elevation={0} className={classes.card}>
      <div className={classes.header}>
        <div className={classes.profile}>
          <Avatar
            alt={selfUser.username}
            src={selfUser.imagePath || undefined}
            className={classes.avatar}
          >
            {selfUser.username.substring(0, 1).toUpperCase()}
          </Avatar>
          <div>
            <Typography variant="h5" component="h1">
              {selfUser.username}
            </Typography>
            <Typography variant="body2" className={classes.subtitle} noWrap>
              {selfUser.bio || "Share a few words about yourself to let the community know you."}
            </Typography>
          </div>
        </div>
        <Button
          component={Link}
          to="/edit"
          variant="outlined"
          color="primary"
          startIcon={<EditIcon />}
        >
          Edit profile
        </Button>
      </div>

      <Divider style={{ margin: "16px 0" }} />

      <div className={classes.stats}>
        <Chip
          icon={<PostAddIcon />}
          label={`${selfUser.postCount} post${selfUser.postCount === 1 ? "" : "s"}`}
          color="primary"
          variant="outlined"
        />
        <Chip
          icon={<PeopleAltIcon />}
          label={`${selfUser.followerCount} follower${selfUser.followerCount === 1 ? "" : "s"}`}
          variant="outlined"
        />
      </div>

      <Typography variant="body2" className={classes.bio}>
        {selfUser.bio || "Add a bio to showcase what makes you unique. Head to the edit page to craft your story."}
      </Typography>

      <div className={classes.actions}>
        <Typography variant="caption" className={classes.subtitle}>
          Signed in with unmatched creative energy. Ready to take a break?
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<ExitToAppIcon />}
          onClick={handleLogout}
          disabled={isProcessing}
        >
          {isProcessing ? "Signing out..." : "Logout"}
        </Button>
      </div>
    </Paper>
  );
};

export default AccountInfo;
