const express=require('express');
const Router = express.Router();
const MessageController=require('../controller/MessageController');
const UserAuthenticatior=require("../middleware/Authorisation");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

Router.post('/add-message',UserAuthenticatior.authenticator,MessageController.AddMessage);

Router.get('/get-message',UserAuthenticatior.authenticator,MessageController.GetMessage);

Router.post('/add-media-message', upload.single('media'), MessageController.AddMediaMessage);

module.exports=Router;