import { sequelize, DataTypes, Model } from '../utils/db';

interface UserProcedureAttributes {
   id: string;
   userId: string;
   procedureId: string;
   masterId: string;
}

interface CreateUserProcedureAttributes extends Omit<UserProcedureAttributes, 'id'> {}

class UserProcedure extends Model<UserProcedureAttributes, CreateUserProcedureAttributes> {
   public id!: string;
   public userId!: string;
   public procedureId!: string;
   public masterId!: string;
}

   UserProcedure.init({
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
         field: 'user_id',
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
      masterId: {
         type: DataTypes.UUID,
         allowNull: false,
         references: {
            model: 'users',
            key: 'id',
         },
         field: 'master_id',
      },
   }, {
      sequelize,
      modelName: 'userProcedure',
      tableName: 'user_procedures',
      timestamps: false,
   });

export default UserProcedure;
