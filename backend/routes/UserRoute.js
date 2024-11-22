const express=require('express');
const Router = express.Router();
const UserController=require('../controller/UserController');
const UserAuthenticatior=require('../middleware/Authorisation')
Router.post('/register-user',UserController.register);
Router.post('/login-user/:email',UserController.Login);

Router.post("/InviteUser",UserAuthenticatior.authenticator,UserController.InviteUse)

module.exports=Router;