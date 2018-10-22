const sendEmail = async (emailPayload) => {
  const message = { ...emailPayload, from: 'StackRoute <projectfullstack@gmail.com>' };
  return message;
};

module.exports = { sendEmail };
