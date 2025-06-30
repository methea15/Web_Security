import mongoose from "mongoose";

//not use anymore
const historySchema = new mongoose.Schema({
    user_id: {
        type: Number,
        required: true
    },
    url_id: {
        type: Number,
        required: true
    },
    searched_at: {
        type: Date,
        default: Date.now
    }  

});

const History = mongoose.model('History', historySchema);
export default History;
