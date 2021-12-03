const errorHandler = (err, req, res, next) => {
  console.log("error message: ", err);

  if (err.name === "CastError") {
    console.log("error: ", err);
    res.status(400).send({ error: `malformatted id` });
  }
  next(err);
};

module.exports = errorHandler;
