const userModel = require("../model/user_model"); 
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
  try {
      const { username, email, password } = req.body;

      // 1. NEW: Check if the user already exists first!
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
          // Send a clean 400 Error instead of crashing the server
          return res.status(400).json({ message: "User already exists with this email" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await userModel.create({
        username, 
        email, 
        password: hashedPassword
      });

      const token = jwt.sign({
        id: user._id, 
      }, process.env.JWT_SECRET || "temporary_backup_secret_123");

      res.status(201).json({
        message: "User registered and token generated successfully",
        user: { 
            id: user._id, 
            username: user.name, 
            email: user.email 
        }, 
        token
      });

  } catch (error) {
      res.status(500).json({ message: "Server error during registration", error: error.message });
  }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        // 1. Check if the user exists in the database
        const user = await userModel.findOne({ email });
        if (!user) {
            // We keep the error vague ("Invalid email or password") for security
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2. Compare the typed password with the hashed password in the DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Generate a new token for this session
        const token = jwt.sign({
            id: user._id, 
        }, process.env.JWT_SECRET || "temporary_backup_secret_123");

        // 4. Send success response
        res.status(200).json({
            message: "Login successful!",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Server error during login", error: error.message });
    }
}

// Don't forget to export the new function at the bottom!
module.exports = { registerUser, loginUser };