module.exports = (
  commitId,
  {
    simpleGit
  }
) => new Promise((res, rej) => {
  simpleGit.log({
    to: commitId
  }, (err, log) => {
    if (err) {
      rej(err);
    } else {
      const {
        date,
        message,
        author_name: authorName,
        author_email: authorEmail
      } = log.latest;

      const commitDetails = {
        date,
        message,
        authorName,
        authorEmail
      };

      res(commitDetails);
    }
  });
});
