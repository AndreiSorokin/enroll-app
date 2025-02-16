import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';
import TimeSlot from './timeSlot';
import Booking from './booking';


User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'userId', as: 'EnrolledProcedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'UsersEnrolled' });

User.hasMany(UserProcedure, { foreignKey: "userId" });
UserProcedure.belongsTo(User, { foreignKey: "masterId", as: "Master" });

Procedure.hasMany(UserProcedure, { foreignKey: "procedureId" });
UserProcedure.belongsTo(Procedure, { foreignKey: "procedureId", as: "Procedure" });

User.belongsToMany(Procedure, { through: MasterProcedure, foreignKey: 'masterId', as: 'MasterProcedures' });
Procedure.belongsToMany(User, { through: MasterProcedure, foreignKey: 'procedureId', as: 'Masters' });

Procedure.hasMany(MasterProcedure, { foreignKey: 'procedureId', as: 'masterProcedures' });
MasterProcedure.belongsTo(Procedure, { foreignKey: 'procedureId', as: 'procedure' });
MasterProcedure.belongsTo(User, { as: 'master', foreignKey: 'masterId' });
User.hasMany(MasterProcedure, { as: 'masterProcedures', foreignKey: 'masterId' });


User.hasMany(TimeSlot, { foreignKey: 'masterId', as: 'timeSlots' });
TimeSlot.belongsTo(User, { foreignKey: 'masterId', as: 'master' });

UserProcedure.hasMany(Booking, { foreignKey: "userProcedureId", as: "Bookings" });
Booking.belongsTo(UserProcedure, { foreignKey: "userProcedureId", as: "UserProcedure" });

User.hasMany(Booking, { foreignKey: 'userId' });
TimeSlot.hasMany(Booking, { foreignKey: "timeSlotId", as: "Bookings" });
Booking.belongsTo(User, { foreignKey: 'userId', as: "User" });
Booking.belongsTo(TimeSlot, { foreignKey: "timeSlotId", as: "TimeSlot" });

TimeSlot.belongsTo(UserProcedure, { foreignKey: "userProcedureId", as: "UserProcedure" });
UserProcedure.hasMany(TimeSlot, { foreignKey: "userProcedureId", as: "TimeSlots" });




export { sequelize, Procedure, UserProcedure, User, MasterProcedure, TimeSlot, Booking };
