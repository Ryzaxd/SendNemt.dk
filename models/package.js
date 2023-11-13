'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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