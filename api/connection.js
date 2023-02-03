const { connect, set } = require("mongoose");

set("strictQuery", true);
connect(process.env.DB_URL, () => {
  console.log(`db connected`);
});
