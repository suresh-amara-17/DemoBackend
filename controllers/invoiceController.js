const { Invoice } = require('../models');

exports.create = async (req, res, next) => {
  try {
    const { title, amount } = req.body;
    const invoice = await Invoice.create({ title, amount, ownerId: req.userId });
    res.status(201).json(invoice);
  } catch (err) { next(err); }
};

exports.list = async (req, res, next) => {
  try {
    const where = ['admin', 'manager'].includes(req.userRole) ? {} : { ownerId: req.userId };
    const items = await Invoice.findAll({ where });
    res.json(items);
  } catch (err) { next(err); }
};

exports.get = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    if (invoice.ownerId !== req.userId && !['admin', 'manager'].includes(req.userRole)) return res.status(403).json({ message: 'Forbidden' });
    res.json(invoice);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    if (invoice.ownerId !== req.userId && req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await invoice.update(req.body);
    res.json(invoice);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Not found' });
    if (invoice.ownerId !== req.userId && req.userRole !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    await invoice.destroy();
    res.status(204).end();
  } catch (err) { next(err); }
};