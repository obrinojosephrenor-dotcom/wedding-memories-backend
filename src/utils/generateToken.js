const jwt = require("jsonwebtoken");

const generateToken = (guest) => {
  return jwt.sign(
    {
      id: guest.id,
      mobile: guest.mobile,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

module.exports = generateToken;