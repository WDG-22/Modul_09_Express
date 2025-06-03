const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.cause.statusCode || 500).json({ msg: err.message });
};

export { errorHandler };
