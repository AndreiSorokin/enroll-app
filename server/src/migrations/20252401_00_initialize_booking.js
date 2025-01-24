const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('bookings', {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
            field: 'user_id',
         },
         timeSlotId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'time_slots',
               key: 'id',
            },
            field: 'time_slot_id',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
         },
         status: {
            type: DataTypes.ENUM('pending', 'confirmed', 'canceled'),
            defaultValue: 'pending',
         },
         createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
         updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
         },
      })
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('bookings');
   }
}