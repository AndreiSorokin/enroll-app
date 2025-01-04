import { Model, DataTypes } from 'sequelize'

const { sequelize } = require('../util/db');

class userProcedure extends Model {};

userProcedure.init({
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
   },
   procedureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: 'procedures',
         key: 'id',
      },
      primaryKey: true,
   }
}, {
   sequelize,
   modelName: 'userProcedure',
   tableName: 'user_procedures',
});