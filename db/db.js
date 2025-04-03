const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/config.env" });

const dbConnect = async () => {
  try {
    const dataAfterConnected = await mongoose.connect(process.env.MONGO_URL);

    console.log(
      `database connected successfully ${dataAfterConnected.connection.host}`
    );
  } catch (error) {
    console.log("database not connected successfully ", error);
    process.exit(1);
  }
};

// const dbConnect =  () => {
//   mongoose
//     .connect(process.env.MONGO_URL)
//     .then((d) => {
//       console.log("database connected successfully ", d.connection.host);
//     })
//     .catch((e) => {
//       console.log("database not connected successfully ", e);
//       process.exit(1);
//     });
// };

module.exports = dbConnect;
