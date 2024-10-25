import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";
import passport from "passport";
import session from "express-session";
import logger from "./utils/logger.js"; // Import the logger
import './passport-setup.js';

dotenv.config({});

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set up session middleware before passport initialization
app.use(session({
    secret: process.env.SESSION_SECRET || 'Asdfghjklqwertre', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);

// Google OAuth routes
app.get('/auth/google', 
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/login', // Redirect to your login route on failure
    }), 
    (req, res) => {
        // Successful authentication
        res.redirect('/'); // Redirect to your desired page after login
    }
);

// Error-Handling Middleware
app.use((err, req, res, next) => {
    logger.error(`Error ${err.status || 500} - ${err.message}`);
    res.status(err.status || 500).json({ message: err.message });
});

// Start Server
app.listen(PORT, () => {
    connectDB();
    logger.info(`Server running at port ${PORT}`);
});
