const { Sequelize } = require("sequelize");

const sq = require("../util/database");

const Admin = sq.define("admin", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports=Admin;