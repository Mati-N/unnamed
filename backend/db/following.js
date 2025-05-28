const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Following = sequelize.define('Following', {
    // No specific fields needed other than foreign keys and timestamps
    // targetId and followerId are added automatically via associations
    // createdAt and updatedAt are handled by Sequelize by default (timestamps: true)
  }, {
    indexes: [
      {
        unique: true,
        fields: ['targetId', 'followerId']
      }
    ]
  });

  Following.associate = (models) => {
    Following.belongsTo(models.User, {
      foreignKey: 'targetId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'target', // The user being followed
    });
    Following.belongsTo(models.User, {
      foreignKey: 'followerId',
      allowNull: false,
      onDelete: 'CASCADE',
      as: 'follower', // The user who is following
    });
  };

  return Following;
};
