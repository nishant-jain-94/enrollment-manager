const email = require('emailjs');
const config = require('../config');

const server = email.server.connect({
  user: config.USER.EMAIL,
  password: config.USER.PASSWORD,
  host: config.USER.HOST,
  ssl: true,
});

const sendEmail = async (emailPayload) => {
  console.log('Sending Email');
  const message = { ...emailPayload, from: 'StackRoute <projectfullstack@gmail.com>' };
  return new Promise((resolve, reject) => {
    server.send(message, (err, response) => {
      if (!err) resolve(response);
      else reject(err);
    });
  });
};

module.exports = { sendEmail };
