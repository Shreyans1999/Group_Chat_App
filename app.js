const Express=require("express");
const app=Express();
const User=require('./backend/models/user');
const Messages=require('./backend/models/message');
const Group=require("./backend/models/Group");
const Member=require('./backend/models/Members');
const Admin=require('./backend/models/Admin');
const sq=require('./backend/util/database');
const UserRoutes=require('./backend/routes/UserRoute');
const MessageRoute=require('./backend/routes/MessageRoute');
const GroupRouts=require('./backend/routes/GroupRoute');
const Cors=require("cors");
const path=require('path');
const helmet=require('helmet');
const bodyParser = require("body-parser");
app.use(bodyParser.json({ extended: false }));
app.use(helmet({contentSecurityPolicy: false}));
app.use(Cors())

//Routes

app.use(UserRoutes);
app.use(MessageRoute);
app.use(GroupRouts)



app.use((req,res)=>{
    console.log(`url is ${req.url}`)
    res.sendFile(path.join(__dirname,`frontend${req.url}`))
  });



//Db Schema

User.hasMany(Messages);
Messages.belongsTo(User);
User.hasMany(Group);
Group.belongsTo(User);
Group.hasMany(Messages);
Messages.belongsTo(Group);
Group.hasMany(Member);
Member.belongsTo(Group);
Group.hasMany(Admin);
Admin.belongsTo(Group);

// Sync database and recreate the table every time
sq.sync({ force: true })
    .then(() => {
        console.log("Database synchronized, and User table recreated.");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
