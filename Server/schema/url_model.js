import mongoose from "mongoose";
//just change
const urlSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['safe', 'malicious', 'phishing'],
        required: true
    },
    checked_at: {
        type: Date,
        default: Date.now,
    },
    details: {
        description: String,
        analysis: {
            protocol: {
                type: String,
                enum: ['HTTP', 'HTTPS']
            },
            domain: {
                name: String, 
                message: String
            }
           },
        source: {
            google: {
                threatTypes: [String],
                expireTime: Date,
            },
            virusTotal: [{
                method: String,
               engine_name: String,
               category: String,
               result: String
            }]
        },
    }
});

const UrlCheck = mongoose.model('UrlCheck', urlSchema);
export default UrlCheck; 