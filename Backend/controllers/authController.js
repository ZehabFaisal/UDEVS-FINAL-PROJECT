const jwt = require("jsonwebtoken");
const { User, RecruiterProfile } = require("../models");

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password_hash: password,
      role: role || "candidate",
    });

    if (role === "recruiter") {
      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company name is required for recruiters",
        });
      }
      await RecruiterProfile.create({
        user_id: user.id,
        company,
        status: "pending",
      });
    }

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is registered as '${user.role}', not '${role}'`,
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } 
  catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.verify = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toJSON(),
    });
  } catch (error) {
    console.error("Verify error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};