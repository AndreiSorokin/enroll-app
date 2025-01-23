import { sequelize, DataTypes, Model } from '../utils/db';

class TimeSlot extends Model {}

TimeSlot.init({
   id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
   },
   masterId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: 'Master',
         key: 'id',
      },
   },
   procedureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: 'Procedure',
         key: 'id',
      },
   },
   date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
   },
   startTime: {
      type: DataTypes.TIME,
      allowNull: false,
   },
   endTime: {
      type: DataTypes.TIME,
      allowNull: false,
   },
   isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
   },
   createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
   },
   slotDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
   },
}, {
   sequelize,
   modelName: 'TimeSlot',
   tableName: 'time_slots',
});

export default TimeSlot;