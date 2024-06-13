const { Employees, sequelize } = require('../models');
const bcrypt = require('bcrypt');

const migratePasswords = async () => {
  try {
    const employee = await Employees.findAll();
    for (let employees of employee) {
      if (!employees.password.startsWith('$2b$')) { 
        const hashedPassword = await bcrypt.hash(employees.password, 10);
        employees.password = hashedPassword;
        await employees.save();
      }
    }
    console.log('Passwords migrated successfully.');
  } catch (error) {
    console.error('Error migrating passwords:', error);
  } finally {
    await sequelize.close();
  }
};

migratePasswords();