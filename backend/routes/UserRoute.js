const express=require('express');
const Router = express.Router();
const UserController=require('../controller/User');

Router.post('/register-user',UserController.register);

module.exports=Router;