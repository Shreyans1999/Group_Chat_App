const { Sequelize } = require("sequelize");
require("dotenv").config();
const sq = new Sequelize(
  `${process.env.DB_SCHEMA}`,
  `${process.env.DB_USER}`,
  `${process.env.DB_PASS}`,
  { dialect: "mysql", host: `${process.env.DB_HOST}`  }
);

module.exports = sq;