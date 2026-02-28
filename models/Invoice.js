const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  status: { 
    type: DataTypes.ENUM('Pending', 'Paid', 'Overdue'), 
    allowNull: false, 
    defaultValue: 'Pending' 
  },
  description: { type: DataTypes.TEXT, allowNull: true },
  ownerId: { type: DataTypes.UUID, allowNull: false }
}, { timestamps: true });

module.exports = Invoice;