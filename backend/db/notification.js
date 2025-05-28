const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    category: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    // recipientId, senderId, postId, commentId are added via associations
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'recipientId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'recipient',
    });
    Notification.belongsTo(models.User, {
      foreignKey: 'senderId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'sender',
    });
    Notification.belongsTo(models.Post, {
      foreignKey: 'postId',
      allowNull: true, // As per Django model (blank=True, null=True)
      onDelete: 'CASCADE', // Or 'SET NULL' if you want to keep notification if post is deleted
      as: 'post',
    });
    Notification.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      allowNull: true, // As per Django model (blank=True, null=True)
      onDelete: 'CASCADE', // Or 'SET NULL'
      as: 'comment',
    });
  };

  return Notification;
};
