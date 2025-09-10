import mongoose from "mongoose";
import UrlCheck from "../schema/url_model.js";
//history save after getting url

export const contentSchema = (item) => {
    return item.map(data => {
        let details = data.details;
        if (typeof details === 'string') {
            try {
                details = JSON.parse(details);
            } catch (error) {
                details = {};
            }
        }    
        return {
            id: data._id,
            url: data.url,
            status: data.status,
            checked_at: data.checked_at,
            full: details
        }
    });
}
//work
export const getHistories = async (req, res) => {
    try {
        const url = await UrlCheck.find({});
        const data = contentSchema(url)
        res.status(200).json({ success: true, data: data })
    } catch (error) {
        console.log("Error in get:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//work
export const createHistories = async (req, res) => {
    const { url, status } = req.body;
    if (!url || !status) {
        throw new Error("invalid data format");
    }
    try {
        const newURL = await UrlCheck.create({url, status});
        res.status(200).json({ success: true, data: newURL });  
    } catch (error) {
        console.error("Error message in create history", error.message);
    }  
}
//work
export const updateHistories = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ success: false, message: "Server error" });
    }
    try {
        const updatedURL = await UrlCheck.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, upsert: true }
        );
        if (!updatedURL) {
            return res.status(404).json({ success: false, message: "URL is not found" });
        }
        res.status(200).json({ success: true, data: updatedURL });
    } catch (error) {
        console.log("Error in update:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}
//work
export const deleteHistories = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Server error" });
    }
    try {
        const deleteURL = await UrlCheck.findByIdAndDelete(id);
        if (!deleteURL) {
            return res.status(404).json({ success: false, message: "URL not found" });
        }
        res.status(200).json({ success: true, message: "URL deleted" });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}