import { sequelize, DataTypes, Model } from '../utils/db';

interface ProcedureAttributes {
   id: string;
   price: number;
   name: string;
}

interface ProcedureCreationAttributes extends Omit<ProcedureAttributes, 'id'> {}

class Procedure extends Model<ProcedureAttributes, ProcedureCreationAttributes> implements ProcedureAttributes {
   public id!: string;
   public price!: number;
   public name!: string;
}

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
      unique: true,
   }
}, {
   sequelize,
   modelName: 'Procedure',
   tableName: 'procedures',
});

export default Procedure;
