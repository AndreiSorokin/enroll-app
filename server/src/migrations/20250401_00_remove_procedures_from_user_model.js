const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      console.log('Running migration - Remove procedures column from users');
      await queryInterface.removeColumn('users', 'procedures');
   },

   down: async ({ context: queryInterface }) => {
      console.log('Reverting migration - Add procedures column back to users');
      await queryInterface.addColumn('users', 'procedures', {
         type: DataTypes.ARRAY(DataTypes.UUID),
         defaultValue: [],
         allowNull: false,
      });
   },
};
