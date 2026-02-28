const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const signTokens = (user) => {
  const payload = { id: user.id, role: user.role };
  const access = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  const refresh = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
  return { access, refresh };
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    const user = await User.create({ email, password, role });
    const tokens = signTokens(user);
    await user.update({ refreshToken: tokens.refresh });
    res.status(201).json({ user: { id: user.id, email: user.email, role: user.role }, tokens });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const tokens = signTokens(user);
    await user.update({ refreshToken: tokens.refresh });
    res.json({ user: { id: user.id, email: user.email, role: user.role }, tokens });
  } catch (err) { next(err); }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid refresh token' });
      const user = await User.findByPk(decoded.id);
      if (!user || user.refreshToken !== refreshToken) return res.status(401).json({ message: 'Token mismatch' });
      const tokens = signTokens(user);
      await user.update({ refreshToken: tokens.refresh });
      res.json({ tokens });
    });
  } catch (err) { next(err); }
};