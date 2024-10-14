const bcrypt = require("bcrypt");
const User = require("../models/user");
exports.register = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const phone = req.body.phone;
  bcrypt.hash(password, 10, async (err, hash) => {
    console.log(err);
    await User.create({
      name: name,
      email: email,
      password: hash,
      number: phone,
    })
      .then((data) => {
        //console.log(data);
        res.status(200).json({ User: data });
      })
      .catch((err) => console.log(err));
  });
};