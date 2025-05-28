const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
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
    firstName: {
      type: DataTypes.STRING,
      allowNull: true, // Django's AbstractUser allows these to be blank
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true, // Django's AbstractUser allows these to be blank
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profileImage: {
      type: DataTypes.STRING, // Store as string path
      allowNull: true,
    },
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  });

  User.associate = (models) => {
    User.hasMany(models.Post, {
      foreignKey: 'userId',
      as: 'posts',
    });
    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
    });
    User.hasMany(models.Like, {
      foreignKey: 'userId',
      as: 'likes', // Renamed from 'likers' for consistency if preferred
    });
    // For Following model
    User.hasMany(models.Following, {
      foreignKey: 'followerId',
      as: 'following', // Users this user is following
    });
    User.hasMany(models.Following, {
      foreignKey: 'targetId',
      as: 'followers', // Users following this user
    });
    // For Notification model
    User.hasMany(models.Notification, {
      foreignKey: 'recipientId',
      as: 'notifications',
    });
    User.hasMany(models.Notification, {
      foreignKey: 'senderId',
      as: 'sentNotifications',
    });
  };

  return User;
};
