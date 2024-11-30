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
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

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

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-group', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on('leave-group', (groupId) => {
    socket.leave(groupId);
    console.log(`User left group: ${groupId}`);
  });

  socket.on('send-message', async (messageData) => {
    io.to(messageData.groupId).emit('receive-message', messageData);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Make io accessible to other parts of the application
app.set('io', io);

// Change app.listen to server.listen
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying ${PORT + 1}`);
    server.listen(PORT + 1);
  }
});
