const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to DB");
});

mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from DB");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose connection closed due to app termination");
    process.exit(0);
});

module.exports = connectDB;
