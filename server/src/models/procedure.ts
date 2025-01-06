import { sequelize, DataTypes, Model } from '../utils/db';

class Procedure extends Model {}

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

export default Procedure;
