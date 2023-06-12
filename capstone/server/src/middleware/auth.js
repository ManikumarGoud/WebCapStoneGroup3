const authCheck = (req, res, next) => {
  const { userId } = req.body;

  if (userId === null || typeof userId !== "string") {
    res.json(false);
  }
};
