import { sequelize, DataTypes, Model } from '../utils/db';

interface ProcedureAttributes {
   id: string;
   name: string;
}

interface ProcedureCreationAttributes extends Omit<ProcedureAttributes, 'id'> {}

class Procedure extends Model<ProcedureAttributes, ProcedureCreationAttributes> implements ProcedureAttributes {
   public id!: string;
   public name!: string;
}

Procedure.init({
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
   },
   name: {
      type: DataTypes.STRING,
      allowNull: false,
   }
}, {
   sequelize,
   modelName: 'Procedure',
   tableName: 'procedures',
});

export default Procedure;
