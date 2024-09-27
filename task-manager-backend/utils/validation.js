const mongoose = require("mongoose");

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
};

const validateObjectId = (string) => {
    return mongoose.Types.ObjectId.isValid(string);
}

module.exports = {
    validateEmail,
    validateObjectId,
}