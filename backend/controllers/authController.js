const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;

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
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

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
