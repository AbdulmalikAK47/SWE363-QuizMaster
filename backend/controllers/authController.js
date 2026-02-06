const User = require("../models/User");
const jwt = require("jsonwebtoken");

// In-memory login rate limiter
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(email) {
    const now = Date.now();
    const record = loginAttempts.get(email);

    if (!record || now - record.firstAttempt > WINDOW_MS) {
        loginAttempts.set(email, { count: 1, firstAttempt: now });
        return true;
    }

    if (record.count >= MAX_ATTEMPTS) {
        return false;
    }

    record.count++;
    return true;
}

function resetRateLimit(email) {
    loginAttempts.delete(email);
}

exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

        // Input validation
        if (!firstName || firstName.length < 2 || firstName.length > 50) {
            return res
                .status(400)
                .json({ message: "First name must be 2-50 characters" });
        }
        if (!lastName || lastName.length < 2 || lastName.length > 50) {
            return res
                .status(400)
                .json({ message: "Last name must be 2-50 characters" });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res
                .status(400)
                .json({ message: "Valid email is required" });
        }
        if (!password || password.length < 6) {
            return res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }

        if (await User.findOne({ email })) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const user = new User({ firstName, lastName, email, password, role });
        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({ token, role: user.role });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        // Rate limiting
        if (!checkRateLimit(email)) {
            return res.status(429).json({
                message:
                    "Too many login attempts. Please try again in 15 minutes.",
            });
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Reset rate limit on successful login
        resetRateLimit(email);

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        next(error);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select(
            "firstName lastName email"
        );
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};
