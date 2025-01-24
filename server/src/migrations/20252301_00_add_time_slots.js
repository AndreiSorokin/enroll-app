const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('time_slots', {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
         },
         masterId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'users',
               key: 'id',
            },
            field: 'master_id',
         },
         procedureId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
               model: 'procedures',
               key: 'id',
            },
            field: 'procedure_id',
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
         },
         date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
         },
         startTime: {
            type: DataTypes.TIME,
            allowNull: false,
         },
         endTime: {
            type: DataTypes.TIME,
            allowNull: false,
         },
         isAvailable: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
         },
         slotDuration: {
            type: DataTypes.INTEGER,
            allowNull: false,
         },
         createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
         },
         updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
         },
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('master_procedures');
   },
}
