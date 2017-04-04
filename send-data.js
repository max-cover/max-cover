const request = require('request');

const coverageUrl = 'someUrl1';
const gitDataUrl = 'someUrl2';

const send = ({ data, url }) => new Promise((res, rej) => {
  request({
    method: 'POST',
    url,
    form: data
  }, (err, response, body) => {
    if (err) {
      rej(err);
    } else {
      const { statusCode } = response;
      if (statusCode !== 200) {
        rej({
          statusCode,
          body
        });
      } else {
        res(body);
      }
    }
  });
});

module.exports = ({
  coverage,
  gitData
}) => {
  return Promise.all(
    [
      send({
        url: coverageUrl,
        data: coverage
      }),
      send({
        url: gitDataUrl,
        data: gitData
      })
    ]
  );
};
