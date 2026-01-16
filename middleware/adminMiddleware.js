const jwt = require("jsonwebtoken");

const adminMiidleware = (req, res, next) => {
  console.log("inside jwt middleware");
  console.log(req.headers);
  try {
    const token = req.headers.authorization.slice(7);
    const jwtVerification = jwt.verify(token, process.env.jwtkey);
    console.log(jwtVerification);
    req.payload = jwtVerification.usermail;
    req.role= jwtVerification.role
    if (req.role == "admin") {
      next();
    } else {
      res.status(402).json("Authorization Error, Only admin can access this page");
    }
  } catch (err) {
    res.status(402).json("Authorization Error" + err);
  }
};
module.exports = adminMiidleware;
