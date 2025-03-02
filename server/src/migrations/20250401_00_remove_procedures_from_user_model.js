const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('users', 'procedures');
   },

   down: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('users', 'procedures', {
         type: DataTypes.ARRAY(DataTypes.UUID),
         defaultValue: [],
         allowNull: false,
      });
   },
};
