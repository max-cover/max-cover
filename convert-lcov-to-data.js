const lcovParse = require('lcov-parse');
const path = require('path');
const readPromise = require('./read-promise.js');

module.exports = (
  input,
  {
    gitPath
  }
) => new Promise((res, rej) => {
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
}).then(data => Promise.all(
  data.map(lcovFileData => readPromise(
    path.join(gitPath, lcovFileData.file)
  ).then(source => Object.assign(
    {
      source
    },
    lcovFileData
  )))
));
