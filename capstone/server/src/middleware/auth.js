const authCheck = (req, res, next) => {
  const { userId } = req.session;
  if (userId) {
    next();
  } else res.status(401).json(false);
};

module.exports = authCheck;
