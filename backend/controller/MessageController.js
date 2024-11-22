const User = require("../models/user");
const Messages = require("../models/message");
const { response } = require("express");

exports.AddMessage = (req, res, next) => {
  const Message = req.body.Message;
 const Id = req.user.id;
  Messages.create({
    content: Message,
    UserId: Id,
  }).then((response) => {
    res.status(201).json({response,message:"Sent successfully"})
  });
};