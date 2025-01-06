import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';

// User and Procedure for enrolled procedures
User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'userId', as: 'EnrolledProcedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'UsersEnrolled' });

// User (master) and Procedure for procedures masters can perform
User.belongsToMany(Procedure, { through: MasterProcedure, foreignKey: 'masterId', as: 'MasterProcedures' });
Procedure.belongsToMany(User, { through: MasterProcedure, foreignKey: 'procedureId', as: 'Masters' });


export { sequelize, Procedure, UserProcedure, User, MasterProcedure };
