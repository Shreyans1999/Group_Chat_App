const express=require('express');
const Router = express.Router();
const MessageController=require('../controller/MessageController');
const UserAuthenticatior=require("../middleware/Authorisation");
const GroupController=require('../controller/GroupController');

Router.post('/createGroup',UserAuthenticatior.authenticator,GroupController.CreateGroup);

Router.get("/getGroupList",UserAuthenticatior.authenticator,GroupController.getGroupList);

Router.get('/showMembers',UserAuthenticatior.authenticator,GroupController.ShowMembers);

Router.delete('/RemoveMember/:id',GroupController.RemoveUser);

Router.post('/MakeAdmin/:id/:name',UserAuthenticatior.authenticator,GroupController.MakeAdmin);

module.exports=Router