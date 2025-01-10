const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('user_procedures', 'master_id', {
         type: DataTypes.UUID,
         allowNull: false,
         references: {
            model: 'users',
            key: 'id',
         },
      });
   },
   down: async (queryInterface) => {
      await queryInterface.removeColumn('user_procedures', 'master_id');
   },
};