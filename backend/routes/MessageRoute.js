const express=require('express');
const Router = express.Router();
const MessageController=require('../controller/MessageController');
const UserAuthenticatior=require("../middleware/Authorisation");

Router.post('/add-message',UserAuthenticatior.authenticator,MessageController.AddMessage);

module.exports=Router;