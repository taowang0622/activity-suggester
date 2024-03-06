const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    accessibility: {
        type: String,
        required: [true, "accessibility is required"],
        enum: {
            values: ['High', 'Medium', 'Low'],
            message: '{VALUE} is not supported'
        }
    },
    price: {
        type: String,
        required: [true, "price is required"],
        enum: {
            values: ['Free', 'Low', 'High'],
            message: '{VALUE} is not supported'
        }
    },
});

const User = mongoose.model("user", userSchema);

module.exports = User;