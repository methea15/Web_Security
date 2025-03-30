import mongoose from "mongoose";


const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    threat_type: {
        type: String
    },
    source: {
        type: String
    },
    status: {
        type: String,
        enum: ['safe', 'malicious', 'phishing'],
        required: true
    },
    checked_at: {
        type: Date,
        default: Date.now
    },
    additional_info: {
        phishing_score: {
            type: Number
        },
        detection_source: {
            type: [String]
        },
        details: {
            type: String
        }
    }

});

const UrlCheck = mongoose.model('UrlCheck', urlSchema);
export default UrlCheck;