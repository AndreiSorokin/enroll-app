const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('procedures', {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         price: {
            type: DataTypes.DECIMAL(10, 2),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
         createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
         },
         updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
         },
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('procedures');
   }
}