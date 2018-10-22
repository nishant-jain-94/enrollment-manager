const path = require('path');

const upload = (req, res, next) => {
  req.file = {
    path: path.join(__dirname, 'test.csv'),
  };
  next();
};

module.exports = { upload };
