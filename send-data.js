const request = require('request');


const send = ({
  data,
  url
}) => new Promise((res, rej) => {
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

module.exports = (data, { appUrl }) => send({
  url: `${appUrl}/api/data`,
  data
});
