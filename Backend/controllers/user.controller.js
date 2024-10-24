import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
        console.log(req.body);

        // Check for missing fields //
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Validate email format // 
        if (!email.includes("@")) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        // Check if the user already exists // 
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash the password // 
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database //
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: "", 
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true,
            user: newUser
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const googleRegister = async (req, res) => {
     const { token } = req.body; 

     try {
         const ticket = await client.verifyIdToken({
             idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
         });

         const { name, email, picture, sub: googleId } = ticket.getPayload();

        //  Check if user already exists // 
         let user = await User.findOne({ email });
         if (!user) {
            // If not, create a new user // 
            user = await User.create({
                 fullname: name,
                email,
                 phoneNumber: '', 
                password: '', 
                role: 'student', 
                 profile: {
                     profilePhoto: picture,
                 },
                googleId, 
             });
        }

         const tokenData = { userId: user._id };
         const authToken = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", authToken, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
             message: `Welcome ${user.fullname}`,
             user: {
                 _id: user._id,
                 fullname: user.fullname,
                 email: user.email,
                 phoneNumber: user.phoneNumber,
                 role: user.role,
                 profile: user.profile
             },
             success: true
         });
     } catch (error) {
         console.error(error);
         return res.status(400).json({
             message: "Google registration failed.",
             success: false,
         });
     }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        // Check if role is correct //
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with the current role.",
                success: false
            });
        }

        const tokenData = { userId: user._id };
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        const file = req.file;
        let cloudResponse;

        if (file) {
            const fileUri = getDataUri(file);
            cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        }

        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }
        const userId = req.id; // middleware authentication //
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user data //
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // Handle resume upload if a file was uploaded //
        if (cloudResponse) {
            user.profile.resume = cloudResponse.secure_url; // Save the Cloudinary URL
            user.profile.resumefullname = file.originalname; // Save the original file name
        }

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

// TESTING BLOCK
// if (process.env.NODE_ENV !== 'production') {
//     const mockRequest = (body, file = null) => ({
//         body,
//         file,
//     });

//     const mockResponse = () => {
//         const res = {};
//         res.status = (statusCode) => {
//             console.log(`Response status: ${statusCode}`);
//             return res;
//         };
//         res.json = (data) => {
//             console.log("Response JSON:", data);
//             return res;
//         };
//         return res;
//     };

//     // Mock Cloudinary uploader
//     cloudinary.uploader = {
//         upload: (fileUriContent) => {
//             console.log("Uploading to Cloudinary:", fileUriContent);
//             return Promise.resolve({
//                 secure_url: 'https://mock-cloudinary-url.com/profile-photo.jpg'
//             });
//         }
//     };

//     // Mock User model
//     User.findOne = async (query) => {
//         console.log("Mock DB Query:", query);
//         return null;
//     };

//     User.create = async (userData) => {
//         console.log("User created with data:", userData);
//         return userData;
//     };

//     // Test the register function
//     const testRegister = async () => {
//         console.log("Testing register function...");

//         const req = mockRequest({
//             fullname: "John Doe",
//             email: "john@example.com",
//             phoneNumber: "1234567890",
//             password: "password123",
//             role: "student"
//         }, {
//             originalname: "profile.jpg",
//             buffer: Buffer.from("sample buffer data"),
//         });

//         const res = mockResponse();

//         await register(req, res);
//     };

//     testRegister();
//     testRegister();
// }
