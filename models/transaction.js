'use strict';
const e = require('express');
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'senderID', as: 'sender' });
      Transaction.belongsTo(models.User, { foreignKey: 'recipientID', as: 'recipient' });
      
      Transaction.belongsTo(models.Package, { foreignKey: 'packageID', as: 'package' });
    }
  }

  Transaction.init({
    packageID: DataTypes.INTEGER,
    senderID: DataTypes.INTEGER,
    recipientID: DataTypes.INTEGER,
    hash: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Transaction',
  });

  return Transaction;
};

