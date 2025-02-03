const { DataTypes } = require("sequelize");

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn("bookings", "user_procedure_id", {
         type: DataTypes.UUID,
         allowNull: true,
         references: {
         model: "user_procedures",
         key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
      });
   },

   down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn("bookings", "user_procedure_id");
   },
};
