const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
  try {
    const { username, password } =
      req.body;

    if (
      username !==
        process.env.ADMIN_USERNAME ||
      password !==
        process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid admin credentials",
      });
    }

    const token = jwt.sign(
      {
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  adminLogin,
};