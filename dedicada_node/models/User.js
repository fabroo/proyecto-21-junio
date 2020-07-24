const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({

    password: {
        type: String,
    },
    dni: {
        type: Number,
        unique: true
    },
    companyID: {
        type: String,
    }
});

UserSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err)
            return cb(err);
        else {
            if (!isMatch)
                return cb(null, isMatch);
            return cb(null, this);
        }
    });
}

module.exports = mongoose.model('UserNew', UserSchema);