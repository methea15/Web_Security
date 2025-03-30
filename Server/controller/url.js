import mongoose from "mongoose";
import UrlCheck from "../schema/url_model.js";

export const getURL = async (req, res) => {
    try {
        const url = await UrlCheck.find({});
        res.status(200).json({ success: true, data: url })
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ success: false, message: "Server error" });

    }
}

export const createURL = async (req, res) => {
    const {url, threat_type, source, status, additional_info} = req.body;
    if (!url || !status) {
        return res.status(400).json({ success: false, message: "Please provide this field" });
    }
    const newURL = new UrlCheck({
        url, threat_type, source, status, additional_info       
    });
    try {
        await newURL.save();
        res.status(201).json({ success: true, data: newURL });
    } catch (error) {
        console.error("Error message", error.message);
        res.status(500).json({ success: false, message: "server error" });
    }
}

export const updateURL = async (req, res) => {
    const { id } = req.params;
    const { url, threat_type, source, status, additional_info } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }

    try {
        const updatedURL = await UrlCheck.findByIdAndUpdate(id, { url, threat_type, source, status, additional_info }, { new: true });
        if (!updateURL) {
            return res.status(404).json({ success: false, message: "URL is not found" });
        }

        res.status(200).json({ success: true, data: updateURL });
    } catch (error) {
        console.log("Error in deleting:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}

export const deleteURL = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(404).json({ success: false, message: "Server error" });
    }
    try {
        await UrlCheck.findByIdAndDelete(id);
        if (!deleteURL) {
            return res.status(404).json({ success: false, message: "URL not found" });
        }
        res.status(200).json({ success: true, message: "URL deleted" });
    } catch (error) {
        console.log("Error in deleting histories:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
}