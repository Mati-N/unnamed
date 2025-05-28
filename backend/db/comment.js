const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comment = sequelize.define('Comment', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // userId and postId are added automatically via associations
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'user',
    });
    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'post',
    });
    Comment.hasMany(models.Notification, { // For notifications related to a comment
        foreignKey: 'commentId',
        as: 'notifications'
    });
  };

  return Comment;
};
