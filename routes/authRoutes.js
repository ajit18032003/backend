const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/emailService');
const crypto = require('crypto');

// @route   GET api/auth/check-setup
// @desc    Check if an admin user already exists
router.get('/check-setup', async (req, res) => {
    try {
        const adminExists = await User.countDocuments() > 0;
        res.json({ adminExists });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/register
// @desc    Register initial admin & send OTP
router.post('/register', async (req, res) => {
    const { username, email, mobile, password } = req.body;

    try {
        // Only allow if no admin exists
        const adminExists = await User.countDocuments() > 0;
        if (adminExists) {
            return res.status(403).json({ message: 'Registration disabled. Admin already exists.' });
        }

        // Generate OTPs
        const emailOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const mobileOtp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = new User({
            username,
            email,
            mobile,
            password,
            otp: {
                email: { code: emailOtp, expiresAt },
                mobile: { code: mobileOtp, expiresAt }
            }
        });

        await user.save();

        // Send Email OTP
        try {
            await sendEmail({
                email: user.email,
                subject: 'Admin Verification OTP',
                message: `Your verification code is: ${emailOtp}. It expires in 10 minutes.`,
                html: `<h1>Verify your admin account</h1><p>Your verification code is: <b>${emailOtp}</b></p><p>It expires in 10 minutes.</p>`
            });
        } catch (emailErr) {
            console.error('Email sending failed:', emailErr.message);
            // Don't fail the whole request, maybe the user can resend
        }

        // Mock Mobile OTP (Print to console)
        console.log(`[MOBILE OTP for ${mobile}]: ${mobileOtp}`);

        res.status(201).json({
            message: 'Admin account created. Please verify your email and mobile.',
            userId: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message || 'Server Error' });
    }
});

// @route   POST api/auth/verify-otp
// @desc    Verify OTP for email/mobile
router.post('/verify-otp', async (req, res) => {
    const { userId, emailOtp, mobileOtp } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const now = new Date();

        // Check Email OTP
        if (user.otp.email.code !== emailOtp || user.otp.email.expiresAt < now) {
            return res.status(400).json({ message: 'Invalid or expired Email OTP' });
        }

        // Check Mobile OTP
        if (user.otp.mobile.code !== mobileOtp || user.otp.mobile.expiresAt < now) {
            return res.status(400).json({ message: 'Invalid or expired Mobile OTP' });
        }

        user.isVerified = true;
        user.otp = undefined; // Clear OTPs
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_fallback_secret',
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username, message: 'Verification successful' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Account not verified. Please register again if needed.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your_fallback_secret',
            { expiresIn: '1h' }
        );

        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
