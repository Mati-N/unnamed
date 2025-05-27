'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        allowNull: false,
      });
      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        as: 'comments',
        onDelete: 'CASCADE',
      });
      Post.hasMany(models.Like, {
        foreignKey: 'postId',
        as: 'likes',
        onDelete: 'CASCADE',
      });
      Post.hasMany(models.Notification, {
        foreignKey: 'postId',
        as: 'notifications',
        onDelete: 'CASCADE', // If a post is deleted, related notifications are also deleted
      });
    }
  }
  Post.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users', // Name of the table, typically plural
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};
