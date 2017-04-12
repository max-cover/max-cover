module.exports = ({
  simpleGit
}) => new Promise((res, rej) => {
  simpleGit.log((err, log) => {
    if (err) {
      rej(err);
    } else {
      const gitCommitIds = log.all.map(commit => commit.hash);

      res(gitCommitIds);
    }
  });
});
