import { Model, DataTypes } from 'sequelize'

const { sequelize } = require('../util/db');

class masterProcedure extends Model {};

masterProcedure.init({
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
   },
   masterId: {
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
   },
}, {
   sequelize,
   modelName: 'MasterProcedure',
   tableName: 'master_procedures',
});