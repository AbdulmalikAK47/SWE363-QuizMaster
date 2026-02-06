const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const ADMIN = {
    firstName: "Admin",
    lastName: "User",
    email: "admin@quizmaster.com",
    password: "admin123",
    role: "quizMaker",
};

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const existing = await User.findOne({ email: ADMIN.email });
        if (existing) {
            console.log(`Admin already exists: ${existing.email}`);
            process.exit(0);
        }

        const admin = await User.create(ADMIN);
        console.log("Admin account created successfully:");
        console.log(`  Name:  ${admin.firstName} ${admin.lastName}`);
        console.log(`  Email: ${admin.email}`);
        console.log(`  Pass:  ${ADMIN.password}`);
        console.log(`  Role:  ${admin.role}`);

        process.exit(0);
    } catch (err) {
        console.error("Failed to create admin:", err.message);
        process.exit(1);
    }
}

createAdmin();
