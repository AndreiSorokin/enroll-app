import { Model, DataTypes } from 'sequelize'

const { sequelize } = require('../util/db');

class Procedure extends Model {};

// Procedure.init({
//    id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//       defaultValue: DataTypes.UUIDV4,
//    },
//    name: DataTypes.STRING,
//    description: DataTypes.TEXT,
// });