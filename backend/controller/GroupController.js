const User = require("../models/user");
const Messages = require("../models/message");
const Groups = require("../models/Group");
const Members = require("../models/Members");

const { response } = require("express");

exports.CreateGroup = async (req, res, next) => {
  try {
    const GroupName = req.body.name;
    const Uid = req.user.id;
    const group = await Groups.create({
      name: GroupName,
      UserId: Uid,
      admin: req.user.name,
    });
    Members.create({
      name: req.user.name,
      GroupId: req.user.id,
      IsAdmin:true
    });
    res.status(201).json({ group, message: "Group createdn successfully" });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.getGroupList = (req, res, next) => {
  Groups.findAll({
    where: {
      UserId: req.user.id,
    },
    attributes: ["name", "id"],
  })
    .then((name) => {
      res.status(200).json({ name });
    })
    .catch((err) => {
      console.log(err);
    });
};