'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        allowNull: false,
      });
      Comment.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
        allowNull: false,
      });
      Comment.hasMany(models.Notification, {
        foreignKey: 'commentId',
        as: 'notifications',
        onDelete: 'CASCADE', // If a comment is deleted, related notifications are also deleted
      });
    }
  }
  Comment.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Name of the table
        key: 'id',
      },
    },
    postId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Posts', // Name of the table
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Comment',
  });
  return Comment;
};
