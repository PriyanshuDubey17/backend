const http = require("http");
const app = require("./app");
require("dotenv").config({path:"./config/config.env"});


const server = http.createServer(app);

server.listen(process.env.PORT, () => {
  console.log(`app is running on ${process.env.PORT}`);
});
