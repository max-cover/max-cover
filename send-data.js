const request = require('request');
// const FormData = require('form-data');

const send = ({
  data,
  url
}) => new Promise((res, rej) => {
  const dataString = JSON.stringify(data);
  const buffer = new Buffer.from(dataString);

  request({
    url,
    method: 'POST',
    formData: {
      file: {
        value: buffer,
        options: { contentType: 'application/json', filename: 'x.json' }
      }
    }
  }, (err, response, body) => {
    if (err) {
      rej(err);
    } else if (response.statusCode !== 200) {
      rej({
        response,
        body
      });
    } else {
      res(body);
    }
  });
});

module.exports = (data, { appUrl }) => send({
  url: `${appUrl}/api/data`,
  data
});
