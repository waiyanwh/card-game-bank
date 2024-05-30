const express = require('express');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get the virtual balance of the authenticated user
router.get('/balance', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('virtualBalance');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ virtualBalance: user.virtualBalance });
    } catch (err) {
        console.error('Error retrieving balance:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/deposit', authMiddleware, async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.virtualBalance += amount;
        await user.save();

        const newTransaction = new Transaction({
            userId,
            amount,
            type: 'deposit'
        });
        await newTransaction.save();

        res.json({ virtualBalance: user.virtualBalance });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/withdraw', authMiddleware, async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.virtualBalance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        user.virtualBalance -= amount;
        await user.save();

        const newTransaction = new Transaction({
            userId,
            amount,
            type: 'withdraw'
        });
        await newTransaction.save();

        res.json({ virtualBalance: user.virtualBalance });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
