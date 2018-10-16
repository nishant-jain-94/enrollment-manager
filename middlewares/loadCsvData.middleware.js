const fs = require('fs');
const csv = require('csvtojson');

const loadCsvData = async (req, res, next) => {
	if (req.file) {
		req.file.data = await csv().fromFile(req.file.path);
	}
	next();
};

module.exports = loadCsvData;
