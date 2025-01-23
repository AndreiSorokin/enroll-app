import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';
import TimeSlot from './timeSlot';

// User and Procedure for enrolled procedures
User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'userId', as: 'EnrolledProcedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'UsersEnrolled' });

// User (master) and Procedure for procedures masters can perform
User.belongsToMany(Procedure, { through: MasterProcedure, foreignKey: 'masterId', as: 'MasterProcedures' });
Procedure.belongsToMany(User, { through: MasterProcedure, foreignKey: 'procedureId', as: 'Masters' });

Procedure.hasMany(MasterProcedure, { foreignKey: 'procedureId', as: 'masterProcedures' });
MasterProcedure.belongsTo(Procedure, { foreignKey: 'procedureId', as: 'procedure' });

User.hasMany(TimeSlot, { foreignKey: 'masterId', as: 'timeSlots' });
TimeSlot.belongsTo(User, { foreignKey: 'masterId', as: 'master' });


export { sequelize, Procedure, UserProcedure, User, MasterProcedure, TimeSlot };
