'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    // Instance method to hash password
    async hashPassword(password) {
      return await bcrypt.hash(password, 10);
    }

    // Instance method to validate password
    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
    }

    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: 'userId',
        as: 'posts',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Comment, {
        foreignKey: 'userId',
        as: 'comments',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Like, {
        foreignKey: 'userId',
        as: 'likes',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Notification, {
        foreignKey: 'recipientId',
        as: 'receivedNotifications',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Notification, {
        foreignKey: 'senderId',
        as: 'sentNotifications',
        onDelete: 'CASCADE',
      });
      // For the Following model
      User.hasMany(models.Following, {
        foreignKey: 'targetId', // User is being followed by others
        as: 'followers',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.Following, {
        foreignKey: 'followerId', // User is following others
        as: 'following',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    bio: {
      type: DataTypes.TEXT,
    },
    profile_image: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          user.password = await user.hashPassword(user.password);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          user.password = await user.hashPassword(user.password);
        }
      },
    },
  });
  return User;
};
