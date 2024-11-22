const Express = require("express");
const app = Express();
const User = require('./backend/models/user');
const Messages=require('./backend/models/message');
const sq=require('./backend/util/database');
const UserRoutes = require('./backend/routes/UserRoute');
const MessageRoute=require('./backend/routes/MessageRoute');
const Cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json({ extended: false }));
app.use(Cors({
    origin: "*"
}));
app.use(UserRoutes);
app.use(MessageRoute);

User.hasMany(Messages);
Messages.belongsTo(User);

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
