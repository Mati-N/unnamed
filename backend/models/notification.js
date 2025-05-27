'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'recipientId',
        as: 'recipient', // The user who receives the notification
        allowNull: false,
      });
      Notification.belongsTo(models.User, {
        foreignKey: 'senderId',
        as: 'sender', // The user who triggered the notification
        allowNull: false,
      });
      Notification.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post', // Associated post, if any
        allowNull: true,
      });
      Notification.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        as: 'comment', // Associated comment, if any
        allowNull: true,
      });
      Notification.belongsTo(models.Like, { // Optional: if you want to directly link notification to a like
        foreignKey: 'likeId',
        as: 'like',
        allowNull: true,
      });
    }
  }
  Notification.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    category: { // e.g., 'like', 'comment', 'follow', 'new_post'
      type: DataTypes.STRING,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    recipientId: { // User receiving the notification
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    senderId: { // User who triggered the notification
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    postId: { // Optional: if the notification is related to a post
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Posts',
        key: 'id',
      },
    },
    commentId: { // Optional: if the notification is related to a comment
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Comments',
        key: 'id',
      },
    },
    likeId: { // Optional: if the notification is related to a like
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Likes',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Notification',
  });
  return Notification;
};
