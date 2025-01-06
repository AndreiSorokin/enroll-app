import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';

// User and Procedure for enrolled procedures
User.belongsToMany(Procedure, { through: 'UserProcedure', foreignKey: 'userId' });
Procedure.belongsToMany(User, { through: 'UserProcedure', foreignKey: 'procedureId' });

// User (master) and Procedure for procedures masters can perform
User.belongsToMany(Procedure, { through: 'MasterProcedure', as: 'MasterProcedures', foreignKey: 'masterId' });
Procedure.belongsToMany(User, { through: 'MasterProcedure', as: 'Masters', foreignKey: 'procedureId' });

export { sequelize, Procedure, UserProcedure, User, MasterProcedure };
