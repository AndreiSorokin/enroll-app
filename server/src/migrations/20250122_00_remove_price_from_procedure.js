const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('procedures', 'price');
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('procedures', 'price', {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.00, 
      });
   },
};