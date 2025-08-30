import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

router.post('/register', async (req, res) => {
  try {
    const { mobile, password, name } = req.body;
    console.log(mobile)
    const exists = await User.findOne({ mobile });
    if (exists) return res.status(400).json({ msg: 'mobile already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ mobile, passwordHash, name});

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, token, user: { id: user._id, mobile, name } });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ ok: true, token, user: { id: user._id, mobile: user.mobile, name: user.name, photoUrl: user.photoUrl } });
  } catch (e) {
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router;
