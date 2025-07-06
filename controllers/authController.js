const User = require('../model/userModel');
const Otp = require('../model/otpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../utils/sendEmail');
const { dbConnect } = require('../config/dbConnect'); // ✅ Import connection function

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

// 1. Send OTP
exports.sendOtp = async (req, res) => {
  try {
    await dbConnect(); // ✅ Ensure DB connection

    let { email } = req.body;
    if (email) email = email.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.create({ email, otp });
    await sendVerificationEmail(email, otp);

    return res.status(200).json({ success: true, message: 'OTP sent successfully' });

  } catch (e) {
    console.error("Send OTP error:", e);
    return res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

// 2. Sign up
exports.createUser = async (req, res) => {
  try {
    await dbConnect();

    let { firstname, middlename, lastname, email, password, gender, otp } = req.body;
    email = email?.trim().toLowerCase();
    firstname = firstname?.trim();
    middlename = middlename?.trim();
    lastname = lastname?.trim();
    password = password?.trim();

    if (!firstname || !lastname || !email || !password || !gender || !otp) {
      return res.status(400).json({ success: false, message: "All fields and OTP are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const recentOtp = await Otp.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp || recentOtp.otp !== otp) {
      return res.status(401).json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ firstname, middlename, lastname, email, password: hashedPassword, gender });

    return res.status(201).json({ success: true, message: "User created successfully" });

  } catch (e) {
    console.error("Create user error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 3. Login
exports.loginUser = async (req, res) => {
  try {
    await dbConnect();

    let { email, password } = req.body;
    email = email?.trim().toLowerCase();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000
    });

    const { _id, firstname, middlename, lastname, email: userEmail, gender, avatar } = user;
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id,
        firstname,
        middlename,
        lastname,
        email: userEmail,
        gender,
        avatar: avatar || null
      }
    });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// 4. Logout
exports.logoutUser = async (req, res) => {
  await dbConnect();

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None"
  });
  res.status(200).json({ success: true, message: "Logout successful" });
};

// 5. Get Profile
exports.getProfile = async (req, res) => {
  try {
    await dbConnect();

    if (!req.user && req.cookies.token) {
      const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    res.json({ success: true, user: req.user });
  } catch (e) {
    console.error("Profile fetch error:", e);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

// 6. Update Profile
exports.updateProfile = async (req, res) => {
  try {
    await dbConnect();

    const updates = {};
    const allowed = ['firstname', 'middlename', 'lastname', 'gender', 'avatar'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      select: '-password'
    });

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (e) {
    console.error("Update profile error:", e);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// 7. Change Password
exports.changePassword = async (req, res) => {
  try {
    await dbConnect();

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password required' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (e) {
    console.error("Change password error:", e);
    res.status(500).json({ success: false, message: 'Failed to change password' });
  }
};

// 8. Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    await dbConnect();

    await User.findByIdAndDelete(req.user._id);
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'None'
    });
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (e) {
    console.error("Delete account error:", e);
    res.status(500).json({ success: false, message: 'Failed to delete account' });
  }
};
