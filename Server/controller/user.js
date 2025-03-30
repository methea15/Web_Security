import mongoose from "mongoose";
import User from "../schema/user_model.js";

export const getUser = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users })
    } catch (error) {
        console.log("Error in getting users:", error.message);
        res.status(500).json({ success: false, message: "Server error" });

    }
}

export const createUser = async (req, res) => {
    const {username, email, password} = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide this field" });
    }
    const newUser = new User({
        username, email, password
    });
    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error message", error.message);
        res.status(500).json({ success: false, message: "server error" });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, email, password } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            username, email, password
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: updateUser });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }
    try {
        await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}