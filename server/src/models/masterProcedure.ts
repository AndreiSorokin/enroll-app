import { sequelize, DataTypes, Model } from '../utils/db';

interface MasterProcedureAttributes {
   id: string;
   masterId: string;
   procedureId: string;
   price: number;
}

interface MasterProcedureCreationAttributes extends Omit<MasterProcedureAttributes, 'id'> {}

class MasterProcedure extends Model<MasterProcedureAttributes, MasterProcedureCreationAttributes> implements MasterProcedureAttributes {
   public id!: string;
   public masterId!: string;
   public procedureId!: string;
   public price!: number;
}

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
      },
      price: {
         type: DataTypes.DECIMAL(10, 2),
         allowNull: false,
         defaultValue: 0.00,
      },
   }, {
      sequelize,
      modelName: 'MasterProcedure',
      tableName: 'master_procedures',
      timestamps: false,
   });

export default MasterProcedure;
