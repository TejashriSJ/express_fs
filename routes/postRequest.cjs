const express = require("express");
const createDirAndFiles = require("../utils/createDirAndFiles.cjs");

const router = express.Router();

function formatError(statusCode, messageForClient) {
  let error = {
    status: statusCode,
    messageObj: { Status: "Error", Message: messageForClient },
  };
  return error;
}

router.post("/", (req, res, next) => {
  let dirName = req.body.dirName;
  let files = req.body.files;

  if (!dirName || !files) {
    let error = formatError(400, "Provide proper format of post body");

    error.messageObj.format = {
      dirName: "Directory Name",
      files: ["Array of file names"],
    };

    next(error);
  } else if (typeof dirName !== "string") {
    next(formatError(422, "Directory name should be string"));
  } else if (dirName.includes("/")) {
    next(formatError(422, "Directory name should not conatin /"));
  } else if (files.length === 0) {
    next(formatError(422, "Provide file names"));
  } else {
    createDirAndFiles(dirName, files)
      .then((settledPromises) => {
        console.log(settledPromises);
        let { createdFiles, notCreatedFiles } = settledPromises.reduce(
          (newObject, promise, index) => {
            if (promise.status === "fulfilled") {
              newObject.createdFiles.push(files[index]);
            } else {
              newObject.notCreatedFiles.push(files[index]);
            }
            return newObject;
          },
          { createdFiles: [], notCreatedFiles: [] }
        );

        if (createdFiles.length === files.length) {
          console.log("All files created successfully");

          res
            .json({
              Status: "Success",
              Message: "All Files Created successfully",
            })
            .end();
        } else if (notCreatedFiles.length === files.length) {
          next(formatError(422, "All files did not Created"));
        } else {
          console.log("Partial Success");

          res
            .json({
              Status: "Partial Success",
              Message: `Only ${createdFiles.length} files Created successfully`,
              Reason: `${notCreatedFiles}  files may not a string or already exist or contain '/'.`,
            })
            .end();
        }
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  }
});

module.exports = router;
