const fs = require("fs/promises");
const path = require("path");

function createDirAndFiles(dirName, files) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.join(__dirname, "userCreatedFiles/", dirName))
      .then(() => {
        let creatingFilesPromises = files.map((file) => {
          return fs.writeFile(
            path.join(__dirname, "userCreatedFiles/", dirName, file),
            ""
          );
        });
        return Promise.allSettled(creatingFilesPromises);
      })
      .then((settledPromises) => {
        resolve(settledPromises);
      })
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });
}
module.exports = createDirAndFiles;
