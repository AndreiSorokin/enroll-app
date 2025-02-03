module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.addConstraint("user_procedures", {
         fields: ["id"],
         type: "unique",
         name: "user_procedures_id_unique"
      });
   },
   down: async ({ context: queryInterface }) => {
      await queryInterface.removeConstraint("user_procedures", "user_procedures_id_unique");
   }
}