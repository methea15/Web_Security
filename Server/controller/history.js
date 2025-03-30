import mongoose from "mongoose";
import History from "../schema/history_model.js";

export const getHistory = async (req, res) => {
    try {
        const histories = await History.find({});
        res.status(200).json({ success: true, data: histories })
    } catch (error) {
        console.log("Error in getting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
        
    }
}

export const createHistory = async (req, res) => {
    const {user_id, url_id} = req.body;
    if (!user_id || !url_id) {
        return res.status(400).json({ success: false, message: "Please provide this field" });
    }
    const newHistory = new History({user_id, url_id});
    try {
        await newHistory.save();
        res.status(201).json({ success: true, data: newHistory });
    } catch (error) {
        console.error("Error message", error.message);
        res.status(500).json({ success: false, message: "server error" });
    }
}

export const updateHistory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }

    try {
        const updatedHistory = await History.findByIdAndUpdate(id);
        res.status(200).json({ success: true, data: updatedHistory });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
   
export const deleteHistory = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }
    try {
        await History.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "History deleted" });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}