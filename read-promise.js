const fs = require('fs');

module.exports = readPath => new Promise((res, rej) => {
  fs.readFile(readPath, 'utf8', (readErr, lcovInput) => {
    if (readErr) {
      rej(readErr);
    } else {
      res(lcovInput);
    }
  });
});
