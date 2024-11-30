const User = require("../models/user");
const Messages = require("../models/message");
const Groups = require("../models/Group");
const Members = require("../models/Members");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const sq = require("../util/database");
const { response } = require("express");
const { where, Sequelize } = require("sequelize");

function generateAccessToken(id, admin) {
  return jwt.sign({ userId: id, admin }, "magical-key");
}

exports.CreateGroup = async (req, res, next) => {
  const t = await sq.transaction();
  try {
    const GroupName = req.body.name;
    const Uid = req.user.id;
    const group = await Groups.create(
      {
        name: GroupName,
        UserId: Uid,
      },
    );
    const GroupId = await Groups.findOne({ where: { name: GroupName } });
    console.log(`GroupId is -----------${GroupId.id}`);
    await Members.create(
      {
        name: req.user.name,
        GroupId: GroupId.id,
        IsAdmin: true,
      },
      
    );
    await Admin.create(
      {
        name: req.user.name,
        GroupId: GroupId.id,
      },
      
    );
    await User.update(
      { IsAdmin: true },
      { where: { id: Uid } }
    );

 
    res.status(201).json({
      group,
      success: true,
      message: "Transaction completed",
      token: generateAccessToken(Uid, true),
    });
  } catch (err) {
    
    console.log(err);
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

exports.ShowMembers = async (req, res, next) => {
  const gid = await Admin.findOne({ where: { name: req.user.name } });
  console.log(gid);

  if (gid == null) {
    res.status(200).json({ message: "Add group to show members" });
  } else {
    const peopeles = await Members.findAll({
      where: { GroupId: gid.id, IsAdmin: null },
    });
    console.log(peopeles);
    res.status(200).json({ peopeles });
  }
};

exports.RemoveUser = async (req, res, next) => {
  const t = sq.transaction();
  const Mid = req.params.id;
  console.log(`members id are ------------------${Mid}`);
  await Members.destroy({ where: { id: Mid } });
  res.status(200).json({ message: "user removed from the group" });
};

exports.MakeAdmin = async (req, res, next) => {
  const t = await sq.transaction();
  try {
    const Mid = req.params.id;
    await Members.update(
      { IsAdmin: true },
      { where: { id: Mid } },
      { transaction: t }
    );
    await User.update(
      { IsAdmin: true },
      { where: { id: Mid } },
      { transaction: t }
    );
    const gid = await Members.findOne(
      {
        where: { id: Mid },
        attributes: ["GroupId"],
      },
      { transaction: t }
    );

    await Admin.create(
      {
        name: req.params.name,
        GroupId: gid.GroupId,
      },
      { transaction: t }
    );
    await t.commit();
    res.status(201).json({ message: "Admin made successfully" });
  } catch (err) {
    (await t).rollback()
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};