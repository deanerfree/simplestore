const errorHandler = (err, req, res, next) => {
  res.status(err.status).json({ message: err.inner.message })
}

module.exports = errorHandler
