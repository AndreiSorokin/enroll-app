module.exports = {
   async up({ context: queryInterface }) {
      await queryInterface.addConstraint('procedures', {
         fields: ['name'],
         type: 'unique',
         name: 'unique_procedure_name',
      });
   },
   async down({ context: queryInterface }) {
      await queryInterface.removeConstraint('procedures', 'unique_procedure_name');
   },
};