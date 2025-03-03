import { sequelize, DataTypes, Model } from '../utils/db';

interface ProcedureAttributes {
   id: string;
   name: string;
   createdAt?: Date | null;
   updatedAt?: Date | null;
   duration: number;
}

interface ProcedureCreationAttributes extends Omit<ProcedureAttributes, 'id'> {}

class Procedure extends Model<ProcedureAttributes, ProcedureCreationAttributes> implements ProcedureAttributes {
   public id!: string;
   public name!: string;
   public createdAt!: Date;
   public updatedAt!: Date;
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
   createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
   },
   updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
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
