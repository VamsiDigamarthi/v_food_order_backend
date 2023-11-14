import jwt from "jsonwebtoken";

export default ValidatedToken = (req, res, next) => {
  let token = req.header("xx-token");

  if (!token) {
    return res.status(401).json({
      resp: false,
      msg: "there is not Token in the request",
    });
  }

  try {
    const { uidPerson } = jwt.verify(token, process.env.APP_KEY_JWT);

    req.uidPerson = uidPerson;

    next();
  } catch (e) {
    return res.status(401).json({
      resp: false,
      msg: e,
    });
  }
};
