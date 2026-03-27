const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        enum: ["pending","completed"],
        default: "pending"
    }
}, {timestamps: true});

module.exports = mongoose.model("Task", taskSchema);