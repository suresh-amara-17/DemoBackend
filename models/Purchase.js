const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Purchase = sequelize.define('Purchase', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  vendor: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL(12,2), allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  status: { 
    type: DataTypes.ENUM('Pending', 'In Transit', 'Completed'), 
    allowNull: false, 
    defaultValue: 'Pending' 
  },
   ownerId: { type: DataTypes.UUID, allowNull: true }
}, { timestamps: true });

module.exports = Purchase;