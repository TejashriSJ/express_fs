const fsPromises = require("fs/promises");
const path = require("path");

function createDirAndFiles(dirName, files) {
  return new Promise((resolve, reject) => {
    fsPromises
      .mkdir(path.join(__dirname, "userCreatedFiles/", dirName), {
        recursive: true,
      })
      .then(() => {
        return fsPromises.readdir(
          path.join(__dirname, "userCreatedFiless/", dirName)
        );
      })
      .then((filesInsideDir) => {
        let creatingFilesPromises = files.map((file) => {
          if (filesInsideDir.includes(file + ".json")) {
            return Promise.reject(`${file} File exist`);
          } else {
            return fsPromises.writeFile(
              path.join(
                __dirname,
                "userCreatedFiles/",
                dirName,
                file + ".json"
              ),
              ""
            );
          }
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
