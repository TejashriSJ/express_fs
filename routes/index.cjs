const express = require("express");

const createDirAndFiles = require("../utils/createDirAndFiles.cjs");
const deleteFiles = require("../utils/deleteFiles.cjs");

const router = express.Router();

router.post("/", (req, res) => {
  if (!req.body.dirName || !req.body.files) {
    let errorMessage = {
      Status: "Error",
      Message: "Provide proper format of post object",
      format: {
        dirName: "Directory Name",
        files: ["Array of file names"],
      },
    };

    res.status(400).json(errorMessage);
  } else if (req.body.dirName.includes("/")) {
    res.status(422).json({
      Status: "Error",
      Message: "Directory name should not contain /",
    });
  } else {
    let dirName = req.body.dirName;
    let files = req.body.files;

    createDirAndFiles(dirName, files)
      .then((settledPromises) => {
        console.log(settledPromises);
        let createdFiles = settledPromises.filter((promise) => {
          return promise.reason === undefined;
        });
        let notCreatedFiles = settledPromises.filter((promise) => {
          return promise.reason !== undefined;
        });
        if (createdFiles.length === files.length) {
          console.log("All files created successfully");

          res.json({
            Status: "Success",
            Message: "All Files Created successfully",
          });
        } else if (notCreatedFiles.length === files.length) {
          throw new Error();
        } else {
          console.log("Partial Success");

          res.json({
            Status: "Partial Success",
            Message: `${createdFiles.length} files Created successfully`,
          });
        }
      })
      .catch((err) => {
        if (err.code === "EEXIST") {
          console.error("Directory Already Exist", err);

          res.status(422).json({
            Status: "Error",
            Message: "Directory Already Exist",
          });
        } else {
          console.error("Files did not created successfully", err);

          res.status(500).json({
            Status: "Error",
            Message: "Files did not created Successfully",
          });
        }
      });
  }
});

router.delete("/", (req, res) => {
  if (!req.body.dirName || !req.body.files) {
    let errorMessage = {
      Status: "Error",
      Message: "Provide proper format of delete object",
      format: {
        dirName: "Directory Name",
        files: ["Array of file names"],
      },
    };

    res.status(400).json(errorMessage);
  } else if (req.body.dirName.includes("/")) {
    res.status(422).json({
      Status: "Error",
      Message: "Directory name should not contain /",
    });
  } else {
    let dirName = req.body.dirName;
    let files = req.body.files;

    deleteFiles(dirName, files)
      .then((settledPromises) => {
        console.log(settledPromises);
        let deletedFiles = settledPromises.filter((promise) => {
          return promise.reason === undefined;
        });
        let notDeletedFiles = settledPromises.filter((promise) => {
          return promise.reason !== undefined;
        });

        if (deletedFiles.length === files.length) {
          console.log("All files deleted successfully");

          res.json({
            Status: "Success",
            Message: "All files deleted successfully",
          });
        } else if (notDeletedFiles.length === files.length) {
          res.status(422).json({
            Status: "Error",
            Message: "No such file or directory",
          });
        } else {
          console.log(`${deletedFiles.length} files deleted successfully`);

          res.json({
            Status: "Partial Success",
            Message: `${deletedFiles.length} files deleted successfully`,
          });
        }
      })
      .catch((err) => {
        console.error("All files did not deleted successfully", err);
        res.status(500).json({
          Status: "Error",
          Message: "All files did not deleted successfully",
        });
      });
  }
});

module.exports = router;
