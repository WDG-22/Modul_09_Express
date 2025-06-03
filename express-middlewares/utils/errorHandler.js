const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.cause) {
    res.status(err.cause.statusCode || 500).json({ msg: err.message });
  } else if (err.errors) {
    res.status(400).json({ msg: err.message });
  } else {
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};

export { errorHandler };
