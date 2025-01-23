const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('procedures', 'duration', {
         type: DataTypes.INTEGER,
         allowNull: false,
         validate: {
            min: 1,
         },
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('procedures', 'duration');
   }
};