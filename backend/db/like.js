const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Like = sequelize.define('Like', {
    // No specific fields needed other than foreign keys and timestamps
    // userId and postId are added automatically via associations
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  }, {
    indexes: [
      {
        unique: true,
        fields: ['userId', 'postId']
      }
    ]
  });

  Like.associate = (models) => {
    Like.belongsTo(models.User, {
      foreignKey: 'userId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'user', // Or 'liker' to match Django related_name if desired
    });
    Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'post',
    });
  };

  return Like;
};
