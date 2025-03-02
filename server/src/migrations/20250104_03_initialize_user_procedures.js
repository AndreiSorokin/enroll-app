const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('user_procedures', {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         user_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
         },
         procedure_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'procedures',
               key: 'id',
            },
            primaryKey: true,
         }
      })
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('user_procedures');
   }
}