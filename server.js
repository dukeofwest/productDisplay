const ftpClient = require("ftp");
const express = require("express");
const bodyParser = require("body-parser");

const client = new ftpClient();

client.connect({
  host: "ftp.transport.productsup.io",
  port: 21,
  user: "pupDev",
  password: "pupDev2018",
});

client.on("ready", function () {
  console.log("ftp client is ready");
});

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type', 'Accept', 'Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Headers", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", function (req, res, next) {
  client.get("table_data.json", function (err, stream) {
    let data = "";
    if (err) next(new Error(err));
    stream.on("data", function (datum) {
      data += datum;
    });

    stream.on("end", () => {
      res.json(JSON.parse(data));
    });
  });
});

app.use((err, req, res, next) => {
  console.log(err);
});

app.listen(3000, () => console.log("listening on port 3000"));
