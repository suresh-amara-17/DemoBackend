const { Purchase } = require('../models');

exports.create = async (req, res, next) => {
  try {
    // accept either itemname or legacy name key
    const { name, vendor, amount, date, status } = req.body;
    const p = await Purchase.create({
      name: name,           // fallback
      vendor,
      amount,
      date,
      status,
      ownerId: req.userId
    });
    res.status(201).json(p);
  } catch (err) {
    next(err);
  }
};

exports.list = async (req, res, next) => {
  try {
    const where = ['user','admin', 'manager'].includes(req.userRole)
      ? {}
      : { ownerId: req.userId };
    const items = await Purchase.findAll({ where });
    res.json(items);
  } catch (err) {
    next(err);
  }
};

exports.get = async (req, res, next) => {
  try {
    const p = await Purchase.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.ownerId !== req.userId && !['user','admin', 'manager'].includes(req.userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const p = await Purchase.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.ownerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // allow any of the model fields
    await p.update(req.body);
    res.json(p);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const p = await Purchase.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    if (p.ownerId !== req.userId && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await p.destroy();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};