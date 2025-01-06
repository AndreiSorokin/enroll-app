import { sequelize, DataTypes, Model } from '../utils/db';

class MasterProcedure extends Model {}

   MasterProcedure.init({
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
      },
   }, {
      sequelize,
      modelName: 'MasterProcedure',
      tableName: 'master_procedures',
   });

export default MasterProcedure;
