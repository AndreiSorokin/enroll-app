const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('users', 'image', {
         type: DataTypes.STRING,
         allowNull: true,
         defaultValue: null,
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('users', 'image');
   },
};