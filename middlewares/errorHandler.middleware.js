const errorHandler = (err, req, res, _) => {
  res.status(err.status || 500);
  res.json({ message: err.message });
};

module.exports = { errorHandler };
