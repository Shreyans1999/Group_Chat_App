const { Sequelize } = require("sequelize");

const sq=require("../util/database");

const Member=sq.define("Members",{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name:{
        type:Sequelize.STRING,
        allowNull:false 
      },
      
});

module.exports=Member