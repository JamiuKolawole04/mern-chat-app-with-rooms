const { Router } = require("express");
const router = Router();

const User = require("../models/user");

router.post("/", async (req, res) => {
  try {
    const { name, email, password, picture } = req.body;
    const user = await User.create({ name, email, password, picture });

    res.status(201).json({
      message: "user created successfully",
      user,
    });
  } catch (err) {
    let message;
    if (err.code === 1100) {
      message = "user already exists";
    } else {
      message = err.message;
    }
    res.status(500).json({
      message,
      err,
    });
  }
});

module.exports = router;
