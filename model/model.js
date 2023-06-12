const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    message: {
        required: true,
        type: String
    },
    username: {
        required: true,
        type: String,
        maxLength: 20
    },
    college:{
        required: true,
        type: String
    },
    avatarimg:{
        required:true,
        type: Number
    }
})
module.exports = mongoose.model('Data', dataSchema)