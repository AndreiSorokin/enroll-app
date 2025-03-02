const { DataTypes } = require('sequelize');

module.exports = {
   up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('users', {
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         name:{
            type: DataTypes.STRING,
            allowNull: false,
         },
         email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
               isEmail: { msg: 'Username must be a valid email address' },
            },
         },
         password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
               min: 8,
               isAlphanumeric: true,
            }
         },
         role: {
            type: DataTypes.ENUM('user', 'admin', 'master'),
            allowNull: false,
            defaultValue: 'user',
            validate: {
               isIn: [['user', 'admin', 'master']],
            },
         },
         active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
         },
      })
   },

   down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('users');
   },
}