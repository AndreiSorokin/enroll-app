const { DataTypes } = require('sequelize');

module.exports = {
  async up({ context: queryInterface }) {
    await queryInterface.addColumn('master_procedures', 'price', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    });
  },
  async down({ context: queryInterface }) {
    await queryInterface.removeColumn('master_procedures', 'price');
  },
};