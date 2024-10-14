const Express=require("express");
const app=Express();
const User=require('./backend/models/user');
const UserRoutes=require('./backend/routes/UserRoute');
const Cors=require("cors");
const bodyParser = require("body-parser");
app.use(Cors());
app.use(bodyParser.json({ extended: false }));

app.use(UserRoutes);


User.sync();

app.listen(4000);