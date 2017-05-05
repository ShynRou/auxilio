const fs = require('fs');


module.exports.loadFile = function (filePath) {
  return new Promise((resolve, reject) => {

    fs.readFile(filePath, (err, data) => {
      if (err || data == null) {
        return reject(err);
      }

      const dict = JSON.parse(data);

      const result = {};

      for (let category in dict) {
        for (let word of dict[category]) {
          if (result[word] != null) {
            result[word].push(category);
          }
          else {
            result[word] = [category];
          }
        }
      }

      return resolve(result);
    });
  });
};