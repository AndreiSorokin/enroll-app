import { sequelize, DataTypes, Model } from '../utils/db';

interface ProcedureAttributes {
   id: string;
   name: string;
   duration: number;
}

interface ProcedureCreationAttributes extends Omit<ProcedureAttributes, 'id'> {}

class Procedure extends Model<ProcedureAttributes, ProcedureCreationAttributes> implements ProcedureAttributes {
   public id!: string;
   public name!: string;
   public duration!: number;
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
   },
   duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
         min: 1,
      },
   },
}, {
   sequelize,
   modelName: 'Procedure',
   tableName: 'procedures',
});

export default Procedure;
