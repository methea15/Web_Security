import mongoose from "mongoose";
import User from "../schema/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//create token that expire in 30 days
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "30d" });
}
//middleware validate jwt token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({
        success: false,
        message: "Unauthorized no token"
    });
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (!decode) return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
        req.userId = decode.userId;
        next();
    } catch (error) {
        console.log("Unable to verify the token", error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}
//get all user
export const getUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            data: users
        })
    } catch (error) {
        console.log("Error in getting users:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
       return res.status(400).json({
            success: false,
           message: "Invalid ID"
        });
    };
    try {
        const updates = { username, email };
        if (password)
            updates.password = await bcrypt.hash(password, 12);
        const updatedUser = await User.findByIdAndUpdate(id,updates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.log("Error in updating users:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({
            success: false,
            message: "Server error"
        });
    }
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted"
        });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}

export const checking = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user)
            return res.status(400).json({
                success: false,
                message:"User not found"
            })
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
//work
export const signUp = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!email || !password || !username)
            throw new Error("Please fill all the fields.");

        const existedUser = await User.findOne({ email });
        console.log("Already Exists", existedUser);
        if (existedUser)
            return res.status(400).json({
                success: false,
                message: "User already exist"
            });        
        const securePassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            email,
            password: securePassword
        })
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            token
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
//work
export const logIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Invalid User!"
            });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword)
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials!'
            });
        const token = generateToken(user._id);
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            token
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}
//work
export const logOut = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logout successfully"
    });
}

