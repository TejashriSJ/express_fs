const express = require("express");
const router = require("./routes/index.cjs");
const createError = require("http-errors");

const server = express();
const PORT = process.env.PORT || 3000;

server.use(express.json());
server.use("/", router);

//catch 404 and forward to error handler
server.use((req, res, next) => {
  next(createError(404));
});
//Handles generic errors
server.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ Status: "Error" });
});

server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
