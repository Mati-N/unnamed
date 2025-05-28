const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // userId is added automatically via association
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  });

  Post.associate = (models) => {
    Post.belongsTo(models.User, {
      foreignKey: 'userId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'user',
    });
    Post.hasMany(models.Comment, {
      foreignKey: 'postId',
      as: 'comments',
    });
    Post.hasMany(models.Like, {
      foreignKey: 'postId',
      as: 'likes',
    });
    Post.hasMany(models.Notification, { // For notifications related to a post
        foreignKey: 'postId',
        as: 'notifications'
    });
  };

  return Post;
};
