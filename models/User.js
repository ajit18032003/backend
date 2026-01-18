const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: (v) => validator.isEmail(v),
            message: 'Please provide a valid email'
        }
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: (v) => validator.isMobilePhone(v),
            message: 'Please provide a valid mobile number'
        }
    },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    otp: {
        email: {
            code: String,
            expiresAt: Date
        },
        mobile: {
            code: String,
            expiresAt: Date
        }
    }
}, { timestamps: true });

// Hash password before saving - Using async/await for compatibility with Mongoose 9.x
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
