const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.cause || 500).json({ error: err.message });
};

export default errorHandler;
