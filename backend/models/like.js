'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Like extends Model {
    static associate(models) {
      Like.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
        allowNull: false,
      });
      Like.belongsTo(models.Post, {
        foreignKey: 'postId',
        as: 'post',
        allowNull: false,
      });
      Like.hasMany(models.Notification, {
        foreignKey: 'likeId',
        as: 'notifications',
        onDelete: 'CASCADE', // If a like is removed, related notifications are also deleted
      });
    }
  }
  Like.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    modelName: 'Like',
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId'],
      },
    ],
  });
  return Like;
};
