const express = require("express");
const deleteFiles = require("../utils/deleteFiles.cjs");

const router = express.Router();

function formatError(statusCode, messageForClient) {
  return {
    status: statusCode,
    messageObj: {
      Status: "Error",
      Message: messageForClient,
    },
  };
}

router.delete("/", (req, res, next) => {
  let dirName = req.body.dirName;
  let files = req.body.files;

  if (!dirName || !req.body.files) {
    let error = formatError(400, "Provide proper format for delete body");

    error.messageObj.format = {
      dirName: "Directory Name",
      files: ["Array of file names"],
    };

    next(error);
  } else if (typeof dirName !== "string") {
    next(formatError(422, "Directory name should be string"));
  } else if (dirName.includes("/")) {
    next(formatError(422, "Directory name should not contain /"));
  } else if (files.length === 0) {
    next(formatError(422, "Provide File Names"));
  } else {
    deleteFiles(dirName, files)
      .then((settledPromises) => {
        console.log(settledPromises);

        let { deletedFiles, notDeletedFiles } = settledPromises.reduce(
          (newObj, promise, index) => {
            if (promise.status === "fulfilled") {
              newObj.deletedFiles.push(files[index]);
            } else {
              newObj.notDeletedFiles.push(files[index]);
            }
            return newObj;
          },
          { deletedFiles: [], notDeletedFiles: [] }
        );

        if (deletedFiles.length === files.length) {
          console.log("All files deleted successfully");

          res
            .json({
              Status: "Success",
              Message: "All files deleted successfully",
            })
            .end();
        } else if (notDeletedFiles.length === files.length) {
          next(formatError(422, "No such file or directory"));
        } else {
          console.log(`${deletedFiles.length} files deleted successfully`);

          res
            .json({
              Status: "Partial Success",
              Message: `Only ${deletedFiles.length} files deleted successfully`,
              Reason: `${notDeletedFiles} files may be not a string or not exist or contain '/'.`,
            })
            .end();
        }
      })
      .catch((err) => {
        console.error("All files did not deleted successfully", err);
        next(err);
      });
  }
});

module.exports = router;
