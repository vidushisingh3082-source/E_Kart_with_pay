const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// In production the client and server run on different domains (e.g. Vercel +
// Render), so the auth cookie needs `secure: true` + `sameSite: "none"` for
// the browser to send it back on cross-site requests. Locally, both run on
// http://localhost, so the stricter cross-site settings aren't needed (and
// `secure: true` would actually break things over plain http).
const isProduction = process.env.NODE_ENV === "production";
const authCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
};

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email or username",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    return res.status(201).json({ success: true, message: "Registration successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ success: false, message: "Incorrect password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res
      .cookie("token", token, { ...authCookieOptions, maxAge: 60 * 60 * 1000 })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          id: user._id,
          role: user.role,
          email: user.email,
          userName: user.userName,
        },
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token", authCookieOptions).json({ success: true, message: "Logged out successfully" });
};

const checkAuth = (req, res) => {
  const user = req.user;
  res.status(200).json({ success: true, message: "Authenticated user", user });
};

module.exports = { registerUser, loginUser, logoutUser, checkAuth };
