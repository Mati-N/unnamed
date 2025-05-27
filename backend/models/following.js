'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Following extends Model {
    static associate(models) {
      Following.belongsTo(models.User, {
        foreignKey: 'targetId',
        as: 'target', // The user being followed
        allowNull: false,
      });
      Following.belongsTo(models.User, {
        foreignKey: 'followerId',
        as: 'follower', // The user who is following
        allowNull: false,
      });
    }
  }
  Following.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    targetId: { // The user being followed
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    followerId: { // The user who is following
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Following',
    indexes: [
      {
        unique: true,
        fields: ['targetId', 'followerId'],
      },
    ],
  });
  return Following;
};
