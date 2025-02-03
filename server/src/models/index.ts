import { sequelize } from '../utils/db';
import Procedure from './procedure';
import UserProcedure from './userProcedure';
import User from './user';
import MasterProcedure from './masterProcedure';
import TimeSlot from './timeSlot';
import Booking from './booking';


// User and Procedure for enrolled procedures
User.belongsToMany(Procedure, { through: UserProcedure, foreignKey: 'user_id', as: 'EnrolledProcedures' });
Procedure.belongsToMany(User, { through: UserProcedure, foreignKey: 'procedureId', as: 'UsersEnrolled' });

User.hasMany(UserProcedure, { foreignKey: "user_id" });
UserProcedure.belongsTo(User, { foreignKey: "master_id", as: "Master" });

Procedure.hasMany(UserProcedure, { foreignKey: "procedure_id" });
UserProcedure.belongsTo(Procedure, { foreignKey: "procedure_id", as: "Procedure" });

// User (master) and Procedure for procedures masters can perform
User.belongsToMany(Procedure, { through: MasterProcedure, foreignKey: 'master_id', as: 'MasterProcedures' });
Procedure.belongsToMany(User, { through: MasterProcedure, foreignKey: 'procedureId', as: 'Masters' });

Procedure.hasMany(MasterProcedure, { foreignKey: 'procedureId', as: 'masterProcedures' });
MasterProcedure.belongsTo(Procedure, { foreignKey: 'procedureId', as: 'procedure' });
MasterProcedure.belongsTo(User, { as: 'master', foreignKey: 'master_id' });
User.hasMany(MasterProcedure, { as: 'masterProcedures', foreignKey: 'master_id' });


User.hasMany(TimeSlot, { foreignKey: 'master_id', as: 'timeSlots' });
TimeSlot.belongsTo(User, { foreignKey: 'master_id', as: 'master' });

UserProcedure.hasMany(Booking, { foreignKey: "user_procedure_id", as: "Bookings" });
Booking.belongsTo(UserProcedure, { foreignKey: "user_procedure_id" });

User.hasMany(Booking, { foreignKey: 'user_id' });
TimeSlot.hasMany(Booking, { foreignKey: 'time_slot_id' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: "User" });
Booking.belongsTo(TimeSlot, { foreignKey: "time_slot_id", as: "TimeSlot" });

TimeSlot.belongsTo(UserProcedure, { foreignKey: "user_procedure_id", as: "UserProcedure" });
UserProcedure.hasMany(TimeSlot, { foreignKey: "user_procedure_id", as: "TimeSlots" });




export { sequelize, Procedure, UserProcedure, User, MasterProcedure, TimeSlot, Booking };
