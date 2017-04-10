const lcovParse = require('lcov-parse');
const path = require('path');

module.exports = ({
  gitPath,
  input
}) => new Promise((res, rej) => {
  lcovParse(input, (parseErr, lcovData) => {
    if (parseErr) {
      rej(parseErr);
    } else {
      const data = lcovData.map(
        lcovFileData => ({
          file: path.relative(gitPath, lcovFileData.file),
          lines: lcovFileData.lines.details
        })
      );
      res(data);
    }
  });
});
