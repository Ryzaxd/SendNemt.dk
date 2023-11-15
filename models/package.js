'use strict';
const e = require('express');
const { Model } = require('sequelize'); 

module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    static associate(models) {
      Package.belongsTo(models.Transaction, { foreignKey: 'id', as: 'package' });
      Package.belongsTo(models.Transaction, { foreignKey: 'senderID', as: 'sentTransactions' });
      Package.belongsTo(models.Transaction, { foreignKey: 'recipientID', as: 'receivedTransactions' });

      Package.belongsTo(models.User, { foreignKey: 'senderID', as: 'sender' });
      Package.belongsTo(models.User, { foreignKey: 'recipientID', as: 'receiver' });
    }
  }

  Package.init({
    senderID: DataTypes.INTEGER,
    recipientID: DataTypes.INTEGER,
    weight: DataTypes.FLOAT,
    dimensions: DataTypes.STRING,
    contents: DataTypes.STRING,
    value: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Package',
  });

  return Package;
};