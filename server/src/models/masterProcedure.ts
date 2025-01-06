import { DataTypes, Sequelize, Model } from 'sequelize';

class MasterProcedure extends Model {
   public id!: string;
   public masterId!: string;
   public procedureId!: string;

   static initModel(sequelize: Sequelize) {
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
   }
}

export default MasterProcedure;
