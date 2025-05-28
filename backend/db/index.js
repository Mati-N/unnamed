const { Sequelize } = require('sequelize');

// Database connection URI
// Prefer DATABASE_URL from environment variables, otherwise use a default for local development
const sequelize = new Sequelize(process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/database_name', {
  logging: false, // Set to console.log to see SQL queries
  dialect: 'postgres',
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Post = require('./post')(sequelize, Sequelize.DataTypes);
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes);
db.Like = require('./like')(sequelize, Sequelize.DataTypes);
db.Following = require('./following')(sequelize, Sequelize.DataTypes);
db.Notification = require('./notification')(sequelize, Sequelize.DataTypes);

// Establish associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Sync all models (optional, good for development, be cautious in production)
// sequelize.sync({ alter: true }); // Use { force: true } to drop and recreate tables

module.exports = db;
