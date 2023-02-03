require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const rooms = ["general", "tech", "finance", "crypto"];

const userRoute = require("./routes/user");
const Message = require("./models/message.model");
const User = require("./models/user.model");

require("./connection");
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  },
});

app.use("/api/v1/auth", userRoute);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server on!",
  });
});

async function getLastMessagesFromRoom(room) {
  let roomMessages = await Message.aggregate([
    { $match: { to: room } },
    { $group: { _id: "$date", messagesByDate: { $push: "$$ROOT" } } },
  ]);
  return roomMessages;
}

function sortRoomMessagesByDate(messages) {
  return messages.sort(function (a, b) {
    let date1 = a._id.split("/");
    let date2 = b._id.split("/");

    date1 = date1[2] + date1[0] + date1[1];
    date2 = date2[2] + date2[0] + date2[1];

    return date1 < date2 ? -1 : 1;
  });
}

app.get("/api/v1/rooms", (req, res) => {});

//socket connections
io.on("connection", (socket) => {
  socket.on("new-user", async () => {
    const members = await User.find();
    // io.emit emits to allusers connected to the socket
    //egg, communicating to all users that a new user is about to join the app
    io.emit("new-user", members);
  });

  socket.on("join-room", async (room) => {
    socket.join(room);
    let roomMessages = await getLastMessagesFromRoom(room);
    roomMessages = sortRoomMessagesByDate(roomMessages);
    // socket.emit emits to the particular user connected to the socket
    // eg, communicating to a user joining the room from socket.on("join-room")
    socket.emit("room-messages", roomMessages);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
