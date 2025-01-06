import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';

// Initialize models
Procedure.initModel(sequelize);
UserProcedure.initModel(sequelize);
User.initModel(sequelize);
MasterProcedure.initModel(sequelize);

// Define associations
User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'userId', as: 'procedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'users' });

User.belongsToMany(Procedure, { through: MasterProcedure, as: 'MasterProcedures', foreignKey: 'masterId' });
Procedure.belongsToMany(User, { through: MasterProcedure, as: 'Masters', foreignKey: 'procedureId' });

export { sequelize, Procedure, UserProcedure, User, MasterProcedure };
