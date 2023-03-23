const fsPromises = require("fs/promises");
const path = require("path");

function deleteFiles(dirName, files) {
  return new Promise((resolve, reject) => {
    let delteFilesPromises = files.map((file) => {
      if (typeof file === "string" && file.includes("/")) {
        return Promise.reject(`${file} not a string or contains /`);
      } else {
        let filePath = path.join(
          __dirname,
          "userCreatedFiles/",
          dirName,
          file + ".json"
        );
        return fsPromises.unlink(filePath);
      }
    });
    Promise.allSettled(delteFilesPromises)
      .then((settledPromises) => {
        resolve(settledPromises);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

module.exports = deleteFiles;
