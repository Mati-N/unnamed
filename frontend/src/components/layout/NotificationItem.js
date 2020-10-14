import React from "react";
import { Link } from "react-router-dom";
import { READ_NOTIFICATION } from "../../Queries";
import { gql, useMutation } from "@apollo/client";
import MarkunreadMailboxTwoToneIcon from "@material-ui/icons/MarkunreadMailboxTwoTone";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: theme.spacing(3),
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const NotificationItem = ({ node }) => {
  const classes = useStyles();

  const [readNotif] = useMutation(READ_NOTIFICATION);

  const readFunc = () => {
    readNotif({
      variables: { id: node.id },
      update: (cache, { data: { readNotification } }) => {
        if (readNotification.ok) {
          cache.writeFragment({
            id: `NotificationNode:${node.id}`,
            fragment: gql`
              fragment Notification on NotificationNode {
                read
              }
            `,
            data: {
              read: readNotification.notification.read,
            },
          });
        }
      },
    });
  };

  const timeSince = (date) => {
    let seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return Math.floor(interval) + (flr === 1 ? " year" : " years");
    }

    interval = seconds / 2592000;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr === 1 ? " month" : " months");
    }

    interval = seconds / 86400;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return Math.floor(flr) + (flr === 1 ? " day" : " days");
    }

    interval = seconds / 3600;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr === 1 ? " hour" : " hours");
    }

    interval = seconds / 60;
    if (interval > 1) {
      const flr = Math.floor(interval);
      return flr + (flr == 1 ? " minute" : " minutes");
    }
    return "Seconds";
  };

  switch (node.category) {
    case "new_follow":
      return (
        <Card
          
          className={node.read ? "notification-read" : "None"}
          classes={{ root: classes.card }}
          variant="outlined"
        >
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              New Follow
            </Typography>
            <Typography variant="h5" component="h2">
              <Link
                to={`user/${node.sender.id}`}
                onClick={() => {
                  readFunc();
                }}
              >
                {node.sender.username}
              </Link>{" "}
              Followed You{" "}
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {timeSince(new Date(node.createdAt))} ago{" "}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                readFunc();
              }}
              startIcon={
                !node.read ? (
                  <MarkunreadMailboxTwoToneIcon />
                ) : (
                  <MarkunreadIcon />
                )
              }
            >
              Mark {node.read && "Un"}Read
            </Button>
          </CardActions>
        </Card>
      );

    case "new_like":
      return (
        <Card
          
          className={node.read ? "notification-read" : "None"}
          classes={{ root: classes.card }}
          variant="outlined"
        >
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              New Like
            </Typography>
            <Typography variant="h5" component="h2">
              <Link
                to={`user/${node.sender.id}`}
                onClick={() => {
                  readFunc();
                }}
              >
                {node.sender.username}
              </Link>{" "}
              Liked your post
            </Typography>
            <Typography className={classes.pos} color="textSecondary">
              {timeSince(new Date(node.createdAt))} ago{" "}
            </Typography>
            <Typography variant="body2" component="p">
              <Link
                to={`/post/${node.post.id}`}
                onClick={() => {
                  readFunc();
                }}
              >
                {node.post.title}
              </Link>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                readFunc();
              }}
              startIcon={
                !node.read ? (
                  <MarkunreadMailboxTwoToneIcon />
                ) : (
                  <MarkunreadIcon />
                )
              }
            >
              Mark {node.read && "Un"}Read
            </Button>
          </CardActions>
        </Card>
      );
    case "new_comment":
      return (
        <Card
          
          className={node.read ? "notification-read" : "None"}
          classes={{ root: classes.card }}
          variant="outlined"
        >
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              New Comment
            </Typography>
            <Typography variant="h5" component="h2">
              <Link
                to={`user/${node.sender.id}`}
                onClick={() => {
                  readFunc();
                }}
              >
                {node.sender.username}
              </Link>{" "}
              Commented on your post:{" "}
              <Typography display="inline">
                <Link
                  to={`/post/${node.comment.post.id}`}
                  onClick={() => {
                    readFunc();
                  }}
                  size={30}
                >
                  {node.comment.post.title}
                </Link>
              </Typography>
            </Typography>

            <Typography
              className={classes.pos}
              color="textSecondary"
              gutterBottom
            >
              {timeSince(new Date(node.createdAt))} ago{" "}
            </Typography>
            <Typography paragraph>
              <Link
                to={`/post/${node.comment.post.id}`}
                onClick={() => {
                  readFunc();
                }}
                color="grey"
                style={{ color: "grey !important" }}
              >
                {node.comment.content.substr(0, 60)}
              </Link>
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              onClick={() => {
                readFunc();
              }}
              startIcon={
                !node.read ? (
                  <MarkunreadMailboxTwoToneIcon />
                ) : (
                  <MarkunreadIcon />
                )
              }
            >
              Mark {node.read && "Un"}Read
            </Button>
          </CardActions>
        </Card>
      );
    default:
      return null;
  }
};

export default NotificationItem;
