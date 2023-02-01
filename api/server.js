const express = require("express");
const cors = require("cors");
const app = express();
const rooms = ["general", "tech", "finance", "crypto"];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
