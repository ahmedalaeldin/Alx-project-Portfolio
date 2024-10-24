// passport-setup.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/user.model.js";

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
        done(null, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/google-register",
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists
        let existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
            return done(null, existingUser);
        }

        // If not, create a new user
        const newUser = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            phoneNumber: profile.phoneNumber || "", // Optional
            role: "user", // Default role
            profile: {
                profilePhoto: profile.photos[0].value,
            }
        });

        done(null, newUser);
    } catch (error) {
        console.error(error);
        done(error, null);
    }
}));
