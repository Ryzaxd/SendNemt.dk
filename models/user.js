'use strict';
const e = require('express');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Transaction, { foreignKey: 'senderID', as: 'sentTransactions' });
      User.hasMany(models.Transaction, { foreignKey: 'recipientID', as: 'receivedTransactions' });
      
      const Package = require('./package'); 
      User.hasMany(models.Package, { foreignKey: 'senderID', as: 'sentPackages' });
      User.hasMany(models.Package, { foreignKey: 'recipientID', as: 'receivedPackages' });
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    zipcode: DataTypes.STRING,
    city: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};