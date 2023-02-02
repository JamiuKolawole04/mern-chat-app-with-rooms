const { connect } = require("mongoose");

connect(process.env.DB_URL, () => {
  console.log(`db connected`);
});
