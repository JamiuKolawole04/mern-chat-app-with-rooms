require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const rooms = ["general", "tech", "finance", "crypto"];

require("./connection");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
  },
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "server on!",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
