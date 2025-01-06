import { DataTypes, Sequelize, Model } from 'sequelize';

class Procedure extends Model {
   public id!: string;
   public price!: number;
   public name!: string;

   static initModel(sequelize: Sequelize) {
      Procedure.init({
         id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
         },
         price: {
            type: DataTypes.DECIMAL(10, 2),
         },
         name: {
            type: DataTypes.STRING,
            allowNull: false,
         },
      }, {
         sequelize,
         modelName: 'Procedure',
         tableName: 'procedures',
      });
   }
}

export default Procedure;
