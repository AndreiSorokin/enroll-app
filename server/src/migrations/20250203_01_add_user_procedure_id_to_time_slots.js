const { DataTypes } = require('sequelize');

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn("time_slots", "user_procedure_id", {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "user_procedures",
        key: "id",
      },
      field: 'user_procedure_id',
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("time_slots", "userProcedureId");
  },
};