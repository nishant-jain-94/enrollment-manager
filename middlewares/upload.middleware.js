const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../user-uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `users-${Date.now()}.csv`);
  },
});

const upload = multer({ storage }).single('users');

module.exports = { upload };
