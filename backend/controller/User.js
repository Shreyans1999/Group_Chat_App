const bcrypt = require("bcrypt");
const User = require("../models/user");
exports.register = async (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;

  const AlreadyExists = await User.findOne({ where: { email: mail } });
  if (AlreadyExists) {
    console.log("user Exists")
    res.status(500).json({ message: "User Already Exists" });
  } else {
   await bcrypt.hash(password, 10, async (err, hash) => {
      console.log(err);
      await User.create({
        name: name,
        email: mail,
        password: hash,
        number: phone,
      });
      res.status(200).json({message:"User Signed Up Successfully"});
    });
  }
};