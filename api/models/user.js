const { Schema } = require("mongoose");
const { isEmail } = require("validator");

const userShema = Schema(
  {
    mame: {
      type: String,
      required: [true, "name cant be blank"],
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "mail cant be blank"],
      index: true,
      validate: [isEmail, "invalid email"],
    },
    password: {
      type: String,
      required: [true, "cant be blank"],
    },
    picture: String,
    newMessages: {
      type: Object,
      default: {},
    },
    status: {
      type: String,
      default: "online",
    },
  },
  { minimize: false, timestamps: true }
);
