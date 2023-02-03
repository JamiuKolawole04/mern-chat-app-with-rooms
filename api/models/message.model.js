const { Schema, model } = require("mongoose");

const messageSchema = Schema({
  content: String,
  from: Object,
  socketid: String,
  time: String,
  date: String,
  to: String,
});

const Message = model("Messages", messageSchema);

module.exports = Message;
