import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import PostAddIcon from "@material-ui/icons/PostAdd";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import PersonAddDisabledIcon from "@material-ui/icons/PersonAddDisabled";
import { FOLLOW } from "../../Queries";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: theme.spacing(3),
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(3),
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(2),
    flexWrap: "wrap",
  },
  avatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    fontSize: "1.5rem",
  },
  stats: {
    display: "flex",
    gap: theme.spacing(1),
    flexWrap: "wrap",
    marginTop: theme.spacing(2),
  },
  bio: {
    marginTop: theme.spacing(2),
    maxWidth: "65ch",
    color: theme.palette.text.secondary,
  },
  actions: {
    marginTop: theme.spacing(2),
  },
}));

const UserInfo = ({ user }) => {
  const classes = useStyles();
  const [follow] = useMutation(FOLLOW);
  const [isWorking, setIsWorking] = useState(false);

  const toggleFollow = () => {
    if (isWorking) {
      return;
    }

    setIsWorking(true);
    follow({
      variables: { id: user.id },
      update: (cache, { data }) => {
        const updatedUser = data?.followUser?.user;
        if (!updatedUser) {
          return;
        }

        cache.writeFragment({
          id: `UserNode:${updatedUser.id}`,
          fragment: gql`
            fragment FollowableUser on UserNode {
              followerCount
              isFollowing
            }
          `,
          data: {
            followerCount: updatedUser.followerCount,
            isFollowing: updatedUser.isFollowing,
          },
        });
      },
    }).finally(() => setIsWorking(false));
  };

  const followerLabel = `${user.followerCount} follower${user.followerCount === 1 ? "" : "s"}`;
  const postLabel = `${user.postCount} post${user.postCount === 1 ? "" : "s"}`;

  return (
    <Paper elevation={0} className={classes.card}>
      <div className={classes.header}>
        <Avatar src={user.imagePath || undefined} alt={user.username} className={classes.avatar}>
          {user.username.substring(0, 1).toUpperCase()}
        </Avatar>
        <div>
          <Typography variant="h5">{user.username}</Typography>
          <Typography variant="body2" color="textSecondary">
            {user.bio || "This creator hasn't added a bio yet."}
          </Typography>
        </div>
      </div>

      <div className={classes.stats}>
        <Chip icon={<PostAddIcon />} label={postLabel} variant="outlined" />
        <Chip icon={<PeopleAltIcon />} label={followerLabel} variant="outlined" />
      </div>

      <Typography variant="body2" className={classes.bio}>
        {user.bio || "Follow them to stay in the loop when they post something new."}
      </Typography>

      <div className={classes.actions}>
        <Button
          variant={user.isFollowing ? "outlined" : "contained"}
          color="primary"
          startIcon={user.isFollowing ? <PersonAddDisabledIcon /> : <PersonAddIcon />}
          onClick={toggleFollow}
          disabled={isWorking}
        >
          {user.isFollowing ? "Unfollow" : "Follow"}
        </Button>
      </div>
    </Paper>
  );
};

export default UserInfo;
