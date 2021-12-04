const errorHandler = (err, req, res, next) => {
  console.log("error message: ", err);

  if (err.name === "CastError") {
    console.log("error: ", err);
    return res.status(400).send({ error: `malformatted id` });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }
  next(err);
};

module.exports = errorHandler;
