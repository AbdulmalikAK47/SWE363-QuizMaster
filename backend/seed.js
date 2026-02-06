require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Quiz = require("./models/Quiz");
const Question = require("./models/Question");
const User = require("./models/User");

const seedData = async () => {
    await connectDB();

    // Find or create an admin user to own the quizzes
    let admin = await User.findOne({ role: "quizMaker" });
    if (!admin) {
        admin = new User({
            firstName: "Admin",
            lastName: "QuizMaster",
            email: "admin@quizmaster.com",
            password: "Admin123!",
            role: "quizMaker",
        });
        await admin.save();
        console.log("Admin user created.");
    }

    const quizzes = [
        // --- SCIENCE ---
        {
            title: "General Science",
            description: "Test your knowledge of basic science concepts.",
            level: "Easy",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "What planet is known as the Red Planet?",
                    choices: [
                        { id: "a", text: "Venus" },
                        { id: "b", text: "Mars" },
                        { id: "c", text: "Jupiter" },
                        { id: "d", text: "Saturn" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What gas do plants absorb from the atmosphere?",
                    choices: [
                        { id: "a", text: "Oxygen" },
                        { id: "b", text: "Nitrogen" },
                        { id: "c", text: "Carbon Dioxide" },
                        { id: "d", text: "Hydrogen" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What is the chemical symbol for water?",
                    choices: [
                        { id: "a", text: "HO" },
                        { id: "b", text: "H2O" },
                        { id: "c", text: "O2H" },
                        { id: "d", text: "OH2" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Which organ pumps blood throughout the body?",
                    choices: [
                        { id: "a", text: "Liver" },
                        { id: "b", text: "Lungs" },
                        { id: "c", text: "Heart" },
                        { id: "d", text: "Brain" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What is the speed of light approximately?",
                    choices: [
                        { id: "a", text: "300,000 km/s" },
                        { id: "b", text: "150,000 km/s" },
                        { id: "c", text: "500,000 km/s" },
                        { id: "d", text: "1,000,000 km/s" },
                    ],
                    correctAnswer: "a",
                },
            ],
        },
        // --- HISTORY ---
        {
            title: "World History",
            description: "How well do you know historical events?",
            level: "Medium",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "In what year did World War II end?",
                    choices: [
                        { id: "a", text: "1943" },
                        { id: "b", text: "1944" },
                        { id: "c", text: "1945" },
                        { id: "d", text: "1946" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Who was the first President of the United States?",
                    choices: [
                        { id: "a", text: "Thomas Jefferson" },
                        { id: "b", text: "George Washington" },
                        { id: "c", text: "Abraham Lincoln" },
                        { id: "d", text: "John Adams" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "The ancient city of Rome was built on how many hills?",
                    choices: [
                        { id: "a", text: "5" },
                        { id: "b", text: "6" },
                        { id: "c", text: "7" },
                        { id: "d", text: "8" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Which empire was ruled by Genghis Khan?",
                    choices: [
                        { id: "a", text: "Ottoman Empire" },
                        { id: "b", text: "Roman Empire" },
                        { id: "c", text: "Mongol Empire" },
                        { id: "d", text: "Persian Empire" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "The Renaissance began in which country?",
                    choices: [
                        { id: "a", text: "France" },
                        { id: "b", text: "Germany" },
                        { id: "c", text: "England" },
                        { id: "d", text: "Italy" },
                    ],
                    correctAnswer: "d",
                },
            ],
        },
        // --- GEOGRAPHY ---
        {
            title: "World Geography",
            description: "Test your knowledge of countries, capitals, and landmarks.",
            level: "Easy",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "What is the largest continent by area?",
                    choices: [
                        { id: "a", text: "Africa" },
                        { id: "b", text: "North America" },
                        { id: "c", text: "Asia" },
                        { id: "d", text: "Europe" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Which country has the largest population?",
                    choices: [
                        { id: "a", text: "India" },
                        { id: "b", text: "United States" },
                        { id: "c", text: "Indonesia" },
                        { id: "d", text: "China" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "What is the capital of Japan?",
                    choices: [
                        { id: "a", text: "Seoul" },
                        { id: "b", text: "Beijing" },
                        { id: "c", text: "Tokyo" },
                        { id: "d", text: "Bangkok" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Which river is the longest in the world?",
                    choices: [
                        { id: "a", text: "Amazon" },
                        { id: "b", text: "Nile" },
                        { id: "c", text: "Mississippi" },
                        { id: "d", text: "Yangtze" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What is the smallest country in the world?",
                    choices: [
                        { id: "a", text: "Monaco" },
                        { id: "b", text: "Vatican City" },
                        { id: "c", text: "San Marino" },
                        { id: "d", text: "Liechtenstein" },
                    ],
                    correctAnswer: "b",
                },
            ],
        },
        // --- PROGRAMMING ---
        {
            title: "Programming Basics",
            description: "Test your programming knowledge across multiple languages.",
            level: "Medium",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "What does HTML stand for?",
                    choices: [
                        { id: "a", text: "Hyper Text Markup Language" },
                        { id: "b", text: "High Tech Modern Language" },
                        { id: "c", text: "Hyper Transfer Markup Language" },
                        { id: "d", text: "Home Tool Markup Language" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "Which language is primarily used for styling web pages?",
                    choices: [
                        { id: "a", text: "JavaScript" },
                        { id: "b", text: "Python" },
                        { id: "c", text: "CSS" },
                        { id: "d", text: "Java" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What symbol is used for single-line comments in JavaScript?",
                    choices: [
                        { id: "a", text: "#" },
                        { id: "b", text: "//" },
                        { id: "c", text: "/* */" },
                        { id: "d", text: "--" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What does API stand for?",
                    choices: [
                        { id: "a", text: "Application Programming Interface" },
                        { id: "b", text: "Application Process Integration" },
                        { id: "c", text: "Automated Programming Interface" },
                        { id: "d", text: "Application Protocol Interface" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "Which data structure uses FIFO (First In First Out)?",
                    choices: [
                        { id: "a", text: "Stack" },
                        { id: "b", text: "Queue" },
                        { id: "c", text: "Tree" },
                        { id: "d", text: "Graph" },
                    ],
                    correctAnswer: "b",
                },
            ],
        },
        // --- MATH ---
        {
            title: "Mathematics Challenge",
            description: "Put your math skills to the test!",
            level: "Hard",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "What is the derivative of x^2?",
                    choices: [
                        { id: "a", text: "x" },
                        { id: "b", text: "2x" },
                        { id: "c", text: "x^2" },
                        { id: "d", text: "2" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What is the value of Pi (to 2 decimal places)?",
                    choices: [
                        { id: "a", text: "3.12" },
                        { id: "b", text: "3.14" },
                        { id: "c", text: "3.16" },
                        { id: "d", text: "3.18" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What is the square root of 144?",
                    choices: [
                        { id: "a", text: "10" },
                        { id: "b", text: "11" },
                        { id: "c", text: "12" },
                        { id: "d", text: "14" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What is 15% of 200?",
                    choices: [
                        { id: "a", text: "25" },
                        { id: "b", text: "30" },
                        { id: "c", text: "35" },
                        { id: "d", text: "40" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "In a right triangle, what is the hypotenuse if the sides are 3 and 4?",
                    choices: [
                        { id: "a", text: "5" },
                        { id: "b", text: "6" },
                        { id: "c", text: "7" },
                        { id: "d", text: "8" },
                    ],
                    correctAnswer: "a",
                },
            ],
        },
        // --- TRUE/FALSE QUIZZES ---
        {
            title: "Science True or False",
            description: "Decide if these science facts are true or false.",
            level: "Easy",
            type: "True/False",
            questions: [
                {
                    text: "The Earth revolves around the Sun.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "Sound travels faster than light.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Diamonds are made of carbon.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "Humans have 206 bones in their body.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "The Pacific Ocean is the smallest ocean.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "b",
                },
            ],
        },
        {
            title: "History True or False",
            description: "Test your history knowledge with true/false questions.",
            level: "Medium",
            type: "True/False",
            questions: [
                {
                    text: "The Great Wall of China is visible from space with the naked eye.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Cleopatra lived closer in time to the Moon landing than to the construction of the Great Pyramid.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "The Titanic sank in 1912.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "Napoleon Bonaparte was unusually short.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "The Berlin Wall fell in 1989.",
                    choices: [
                        { id: "a", text: "True" },
                        { id: "b", text: "False" },
                    ],
                    correctAnswer: "a",
                },
            ],
        },
        // --- GENERAL KNOWLEDGE ---
        {
            title: "General Knowledge",
            description: "A mix of interesting trivia questions.",
            level: "Easy",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "How many continents are there?",
                    choices: [
                        { id: "a", text: "5" },
                        { id: "b", text: "6" },
                        { id: "c", text: "7" },
                        { id: "d", text: "8" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What is the currency of Japan?",
                    choices: [
                        { id: "a", text: "Won" },
                        { id: "b", text: "Yuan" },
                        { id: "c", text: "Yen" },
                        { id: "d", text: "Ringgit" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Which animal is known as the King of the Jungle?",
                    choices: [
                        { id: "a", text: "Tiger" },
                        { id: "b", text: "Lion" },
                        { id: "c", text: "Elephant" },
                        { id: "d", text: "Bear" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "How many players are on a standard soccer team?",
                    choices: [
                        { id: "a", text: "9" },
                        { id: "b", text: "10" },
                        { id: "c", text: "11" },
                        { id: "d", text: "12" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What is the hardest natural substance on Earth?",
                    choices: [
                        { id: "a", text: "Gold" },
                        { id: "b", text: "Iron" },
                        { id: "c", text: "Diamond" },
                        { id: "d", text: "Titanium" },
                    ],
                    correctAnswer: "c",
                },
            ],
        },
        // --- ADVANCED PROGRAMMING ---
        {
            title: "Advanced Programming",
            description: "Challenge yourself with advanced programming concepts.",
            level: "Hard",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "What is the time complexity of binary search?",
                    choices: [
                        { id: "a", text: "O(n)" },
                        { id: "b", text: "O(log n)" },
                        { id: "c", text: "O(n^2)" },
                        { id: "d", text: "O(1)" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Which design pattern ensures only one instance of a class?",
                    choices: [
                        { id: "a", text: "Factory" },
                        { id: "b", text: "Observer" },
                        { id: "c", text: "Singleton" },
                        { id: "d", text: "Strategy" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "What does REST stand for in web development?",
                    choices: [
                        { id: "a", text: "Representational State Transfer" },
                        { id: "b", text: "Remote Execution Standard Technology" },
                        { id: "c", text: "Rapid Enterprise Service Toolkit" },
                        { id: "d", text: "Resource Efficient Structured Transactions" },
                    ],
                    correctAnswer: "a",
                },
                {
                    text: "In React, what hook is used for side effects?",
                    choices: [
                        { id: "a", text: "useState" },
                        { id: "b", text: "useEffect" },
                        { id: "c", text: "useContext" },
                        { id: "d", text: "useRef" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What is the purpose of a foreign key in a database?",
                    choices: [
                        { id: "a", text: "To uniquely identify records" },
                        { id: "b", text: "To link two tables together" },
                        { id: "c", text: "To encrypt data" },
                        { id: "d", text: "To sort records" },
                    ],
                    correctAnswer: "b",
                },
            ],
        },
        // --- LITERATURE ---
        {
            title: "Literature & Books",
            description: "How well do you know famous books and authors?",
            level: "Medium",
            type: "Multiple_Choice",
            questions: [
                {
                    text: "Who wrote 'Romeo and Juliet'?",
                    choices: [
                        { id: "a", text: "Charles Dickens" },
                        { id: "b", text: "William Shakespeare" },
                        { id: "c", text: "Jane Austen" },
                        { id: "d", text: "Mark Twain" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "What is the first book of the Harry Potter series?",
                    choices: [
                        { id: "a", text: "The Chamber of Secrets" },
                        { id: "b", text: "The Prisoner of Azkaban" },
                        { id: "c", text: "The Philosopher's Stone" },
                        { id: "d", text: "The Goblet of Fire" },
                    ],
                    correctAnswer: "c",
                },
                {
                    text: "Who is the author of '1984'?",
                    choices: [
                        { id: "a", text: "Aldous Huxley" },
                        { id: "b", text: "George Orwell" },
                        { id: "c", text: "Ray Bradbury" },
                        { id: "d", text: "H.G. Wells" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Which novel begins with 'Call me Ishmael'?",
                    choices: [
                        { id: "a", text: "The Great Gatsby" },
                        { id: "b", text: "Moby Dick" },
                        { id: "c", text: "Pride and Prejudice" },
                        { id: "d", text: "War and Peace" },
                    ],
                    correctAnswer: "b",
                },
                {
                    text: "Who wrote 'The Lord of the Rings'?",
                    choices: [
                        { id: "a", text: "C.S. Lewis" },
                        { id: "b", text: "J.R.R. Tolkien" },
                        { id: "c", text: "George R.R. Martin" },
                        { id: "d", text: "Terry Pratchett" },
                    ],
                    correctAnswer: "b",
                },
            ],
        },
    ];

    console.log("Seeding quizzes...");

    for (const quizData of quizzes) {
        const { questions, ...quizFields } = quizData;

        // Check if quiz already exists
        const existing = await Quiz.findOne({ title: quizFields.title });
        if (existing) {
            console.log(`  Skipping "${quizFields.title}" (already exists)`);
            continue;
        }

        const quiz = new Quiz({
            ...quizFields,
            createdBy: admin._id,
        });
        await quiz.save();

        for (const q of questions) {
            const question = new Question({
                ...q,
                quiz: quiz._id,
            });
            await question.save();
        }

        console.log(`  Created "${quizFields.title}" with ${questions.length} questions`);
    }

    console.log("\nSeeding complete!");
    process.exit(0);
};

seedData().catch((err) => {
    console.error("Seed error:", err);
    process.exit(1);
});
