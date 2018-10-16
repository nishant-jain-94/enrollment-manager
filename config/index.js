const config = {
	PORT: process.env.PORT ? process.env.PORT : 8090,
	MONGODB_URL: process.env.MONGODB_URL ? process.env.MONGODB_URL : 'mongodb://localhost',
	CALENDARID: process.env.CALENDARID ? process.env.CALENDARID : 'primary',
};

module.exports = config;
