import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';
import TimeSlot from './timeSlot';
import Booking from './booking';


// User and Procedure for enrolled procedures
User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'userId', as: 'EnrolledProcedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'UsersEnrolled' });

User.hasMany(UserProcedure, { foreignKey: "userId" });
UserProcedure.belongsTo(User, { foreignKey: "userId" });

Procedure.hasMany(UserProcedure, { foreignKey: "procedureId" });
UserProcedure.belongsTo(Procedure, { foreignKey: "procedureId", as: "Procedure" });

UserProcedure.belongsTo(User, { foreignKey: "masterId", as: "Master" });

// User (master) and Procedure for procedures masters can perform
User.belongsToMany(Procedure, { through: MasterProcedure, foreignKey: 'masterId', as: 'MasterProcedures' });
Procedure.belongsToMany(User, { through: MasterProcedure, foreignKey: 'procedureId', as: 'Masters' });

Procedure.hasMany(MasterProcedure, { foreignKey: 'procedureId', as: 'masterProcedures' });
MasterProcedure.belongsTo(Procedure, { foreignKey: 'procedureId', as: 'procedure' });
MasterProcedure.belongsTo(User, { as: 'master', foreignKey: 'masterId' });
User.hasMany(MasterProcedure, { as: 'masterProcedures', foreignKey: 'masterId' });


User.hasMany(TimeSlot, { foreignKey: 'masterId', as: 'timeSlots' });
TimeSlot.belongsTo(User, { foreignKey: 'masterId', as: 'master' });

User.hasMany(Booking, { foreignKey: 'userId' });
TimeSlot.hasOne(Booking, { foreignKey: 'timeSlotId' });
Booking.belongsTo(User, { foreignKey: 'userId' });
Booking.belongsTo(TimeSlot, { foreignKey: 'timeSlotId' });



export { sequelize, Procedure, UserProcedure, User, MasterProcedure, TimeSlot, Booking };
