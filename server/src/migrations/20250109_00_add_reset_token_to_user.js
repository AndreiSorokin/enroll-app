const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('users', 'reset_token', {
         type: DataTypes.STRING,
         allowNull: true,
         defaultValue: null,
      });
      await queryInterface.addColumn('users', 'reset_token_expires_at', {
         type: DataTypes.DATE,
         allowNull: true,
         defaultValue: null,
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('users','reset_token');
      await queryInterface.removeColumn('users','reset_token_expires_at');
   },
};