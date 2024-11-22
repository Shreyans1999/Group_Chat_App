const { Sequelize } = require("sequelize");

const sq=require("../util/database");

const Messages=sq.define("Messages",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      }
});

module.exports=Messages;