const User = require("../models/user");
const Messages = require("../models/message");
const Group = require("../models/Group");
const { response } = require("express");
const sq = require("sequelize");
const Sequelize=require('../util/database');

exports.AddMessage = async (req, res, next) => {
  const t = Sequelize.transaction();
  try {
    const Message = req.body.Message;
    const Id = req.user.id;
    const Gid = req.body.groupId;

    const response = await Messages.create({
      content: Message,
      UserId: Id,
      GroupId: Gid,
    });

    // Emit the message through socket.io
    req.app.get('io').to(Gid).emit('receive-message', {
      content: Message,
      User: { 
        name: req.user.name
      },
      GroupId: Gid
    });

    res.status(201).json({ response, message: "Sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.GetMessage = async (req, res, next) => {
  const Id = req.user.id;
  console.log(Id);
  let messageId = req.query.messageId;
  if (messageId === undefined) {
    messageId = -1;
  }
console.log(`mesdawefawfa----${messageId}`)
  const GroupID = req.query.groupId || 1;
  console.log(`GiD--------is ${req.query.groupId}`);
  await Messages.findAll({
    where: {
      id: {
        [sq.Op.gt]: messageId,
      },
      GroupId: GroupID,
    },
    include: [
      {
        model: User,
        attributes: ["name"],
      },
      {
        model: Group,
        attributes: ["name","id"],
      },
    ],
  })
    .then((messages) => {
      res.status(200).json({ messages });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    });
};

exports.AddMediaMessage = async (req, res, next) => {
  try {
    const mediaFile = req.file;
    const groupId = req.body.groupId;
    const mediaType = req.body.type;
    const mediaData = mediaFile.buffer.toString('base64');

    const response = await Messages.create({
      content: mediaData,
      type: mediaType,
      UserId: req.user.id,
      GroupId: groupId,
    });

    req.app.get('io').to(groupId).emit('receive-message', {
      content: `data:${mediaFile.mimetype};base64,${mediaData}`,
      type: mediaType,
      User: { 
        name: req.user.name
      },
      GroupId: groupId
    });

    res.status(201).json({ response, message: "Media sent successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};