const bcrypt = require("bcryptjs");

const generateAccessCode = require("../utils/generateAccessCode");
const generateToken = require("../utils/generateToken");
const supabase = require("../config/supabase");

const {
  findGuestByMobile,
  createGuest,
  updateLastLogin,
} = require("../services/authService");

/*
|--------------------------------------------------------------------------
| REGISTER GUEST
|--------------------------------------------------------------------------
*/
const registerGuest = async (req, res) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Name and mobile are required",
      });
    }

    const existingGuest =
      await findGuestByMobile(mobile);

    if (existingGuest) {
      return res.status(409).json({
        success: false,
        message:
          "Mobile number already registered",
      });
    }

    const accessCode =
      generateAccessCode();

    const hashedCode =
      await bcrypt.hash(accessCode, 10);

    const guest = await createGuest({
      name,
      mobile,
      access_code_hash: hashedCode,
      upload_count: 0,
    });

    return res.status(201).json({
      success: true,
      message:
        "Guest registered successfully",
      accessCode,
      guest: {
        id: guest.id,
        name: guest.name,
        mobile: guest.mobile,
      },
    });
  } catch (error) {
    console.error(
      "REGISTER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN GUEST
|--------------------------------------------------------------------------
*/
const loginGuest = async (req, res) => {
  try {
    const { mobile, accessCode } =
      req.body;

    console.log(
      "LOGIN BODY:",
      req.body
    );

    const guest =
      await findGuestByMobile(mobile);

    if (!guest) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        accessCode,
        guest.access_code_hash
      );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    await updateLastLogin(
      guest.id
    );

    const token =
      generateToken(guest);

    return res.status(200).json({
      success: true,
      token,
      guest: {
        id: guest.id,
        name: guest.name,
        mobile: guest.mobile,
        upload_count:
          guest.upload_count,
      },
    });
  } catch (error) {
    console.error(
      "LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET CURRENT GUEST PROFILE
|--------------------------------------------------------------------------
*/
const getProfile = async (req, res) => {
  try {
    const { data, error } =
      await supabase
        .from("guests")
        .select("*")
        .eq("id", req.user.id)
        .single();

    if (error) {
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });
    }

    return res.status(200).json({
      success: true,
      guest: data,
    });
  } catch (error) {
    console.error(
      "PROFILE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerGuest,
  loginGuest,
  getProfile,
};