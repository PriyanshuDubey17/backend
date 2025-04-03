const express = require("express");
const app = express();
const dbConnect = require("./db/db");
const userRoute = require("./routes/user.route");
const errorHandler = require("./middleware/error.middleware");
const fileUpload = require("express-fileupload");
const contactRoute = require("./routes/contact.route");
dbConnect();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRoute);
app.use("/api/v1/contact", contactRoute);

app.use(errorHandler);

module.exports = app;
