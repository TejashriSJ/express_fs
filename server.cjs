const express = require("express");
const routerPostRequest = require("./routes/postRequest.cjs");
const routerDeleteRequest = require("./routes/deleteRequest.cjs");
const createError = require("http-errors");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.post("/", routerPostRequest);
server.delete("/", routerDeleteRequest);

server.use((req, res, next) => {
  next(createError(404));
});

server.use((err, req, res, next) => {
  res.status(err.status || 500);

  res.json(err.messageObj || { Status: "Error" });
});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
