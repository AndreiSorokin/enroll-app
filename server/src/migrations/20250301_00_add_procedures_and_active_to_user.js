const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      console.log('Running migration - Add procedures and active to user');
      await queryInterface.addColumn('users', 'active', {
         type: DataTypes.BOOLEAN,
         defaultValue: true,
         allowNull: false,
      });

      await queryInterface.addColumn('users', 'procedures', {
         type: DataTypes.ARRAY(DataTypes.UUID),
         defaultValue: [],
         allowNull: false,
      });
   },

   down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('users', 'active');
      await queryInterface.removeColumn('users', 'procedures');
   },
}