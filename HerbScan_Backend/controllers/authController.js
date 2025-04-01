const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please fill out all fields with valid information." });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userType = email === "admin@gmail.com" ? "admin" : "user";

        const newUser = new User({ name, email, password: hashedPassword, userType });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, userType }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(201).json({ token, userType });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong. Please try again." });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Debugging: Log the request
        console.log("Login Request:", email, password);

        // Hardcoded admin credentials
        if (email === "Admin_123" && password === "12345678") {
            console.log("Admin Login Successful!");
            const token = jwt.sign({ userType: "admin" }, process.env.JWT_SECRET, { expiresIn: "24h" });
            return res.status(200).json({ message: "Admin logged in successfully", token, userType: "admin" });
        }

        // Check if user exists in database
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found in DB.");
            return res.status(400).json({ message: "User not found. Please sign up first." });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Incorrect Password.");
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id, userType: user.userType }, process.env.JWT_SECRET, { expiresIn: "1h" });

        console.log("User Login Successful!");
        res.status(200).json({ message: "Login successful", token, userType: user.userType });

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



module.exports = { registerUser, loginUser };
