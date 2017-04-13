const arrayToMappedObject = require('./array-to-mapped-object.js');

module.exports = (
  commitId,
  {
    simpleGit
  }
) => new Promise((res, rej) => {
  simpleGit.diffSummary(commitId, (err, diffSummary) => {
    if (err) {
      rej(err);
    } else {
      res(diffSummary.files);
    }
  });
})
.then(arrayToMappedObject('file'));
