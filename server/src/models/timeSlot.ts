import { sequelize, DataTypes, Model } from '../utils/db';
import { Optional } from 'sequelize';

interface TimeSlotAttributes {
   id: string;
   masterId: string;
   procedureId: string;
   date: string;
   startTime: string;
   endTime: string;
   isAvailable: boolean;
   createdAt?: Date;
   slotDuration?: number;
}

interface TimeSlotCreationAttributes extends Optional<TimeSlotAttributes, 'id'> {}

class TimeSlot extends Model<TimeSlotAttributes, TimeSlotCreationAttributes> implements TimeSlotAttributes {
   public id!: string;
   public masterId!: string;
   public procedureId!: string;
   public date!: string;
   public startTime!: string;
   public endTime!: string;
   public isAvailable!: boolean;
   public readonly createdAt!: Date;
   public slotDuration!: number;
}

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
         model: 'users',
         key: 'id',
      },
      field: 'master_id',
   },
   procedureId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
         model: 'procedures',
         key: 'id',
      },
      field: 'procedure_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
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