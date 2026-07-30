const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true // This ensures no two users can sign up with the exact same email
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true }); // Automatically adds 'createdAt' and 'updatedAt' dates

const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;