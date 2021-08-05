const mongoose = require("mongoose");

const TodoSchema = mongoose.Schema({
    content: String,
    date:{type: String},
    uid:{type: String},
    priority:{type: String, enum: ["1", "2", "3"],default: "3"}
})

module.exports = mongoose.model("todo", TodoSchema)