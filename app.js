const Express = require("express");
const app = Express();
const User = require('./backend/models/user');
const UserRoutes = require('./backend/routes/UserRoute');
const Cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json({ extended: false }));
app.use(Cors({
    origin: "*"
}));
app.use(UserRoutes);

// Sync database and recreate the table every time
User.sync({ force: true })
    .then(() => {
        console.log("Database synchronized, and User table recreated.");
    })
    .catch((err) => {
        console.error("Error synchronizing database:", err);
    });

app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
