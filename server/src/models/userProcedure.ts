import { DataTypes, Sequelize, Model } from 'sequelize';

class UserProcedure extends Model {
   public id!: string;
   public userId!: string;
   public procedureId!: string;

   static initModel(sequelize: Sequelize) {
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
         modelName: 'userProcedure',
         tableName: 'user_procedures',
      });
   }
}

export default UserProcedure;
