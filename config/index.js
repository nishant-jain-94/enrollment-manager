const config = {
  PORT: process.env.PORT ? process.env.PORT : 8090,
  MONGODB_URL: process.env.MONGODB_URL ? process.env.MONGODB_URL : 'mongodb://localhost',
  CALENDARID: process.env.CALENDARID ? process.env.CALENDARID : 'primary',
  USER: {
    EMAIL: process.env.USER_EMAIL,
    PASSWORD: process.env.USER_PASSWORD,
    HOST: process.env.USER_EMAIL_SMTP,
  },
};

module.exports = config;
