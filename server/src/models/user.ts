import { sequelize, DataTypes, Model } from '../utils/db';

interface UserAttributes {
   id: string;
   name: string;
   email: string;
   password: string;
   role: 'user' | 'admin' | 'master';
   active: boolean;
   resetToken?: string | null;
   resetTokenExpiresAt?: Date | null;
   image?: string | null;
}

interface UserCreationAttributes {
   name: string;
   email: string;
   password: string;
   role: 'user' | 'admin' | 'master';
   active: boolean;
   resetToken?: string | null;
   resetTokenExpiresAt?: Date | null;
   image?: string | null;
}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
   public id!: string;
   public name!: string;
   public email!: string;
   public password!: string;
   public role!: 'user' | 'admin' | 'master';
   public active!: boolean;
   public resetToken!: string | null;
   public resetTokenExpiresAt!: Date | null;
   public image!: string | null;
}

   User.init({
      id: {
         type: DataTypes.UUID,
         primaryKey: true,
         defaultValue: DataTypes.UUIDV4,
      },
      name: {
         type: DataTypes.STRING,
         allowNull: false,
      },
      email: {
         type: DataTypes.STRING,
         unique: true,
         allowNull: false,
         validate: {
            isEmail: { msg: 'Username must be a valid email address' },
         },
      },
      password: {
         type: DataTypes.STRING,
         allowNull: false,
         validate: {
            min: 8,
         },
      },
      role: {
         type: DataTypes.ENUM('user', 'admin', 'master'),
         allowNull: false,
         defaultValue: 'user',
         validate: {
            isIn: [['user', 'admin', 'master']],
         },
      },
      active: {
         type: DataTypes.BOOLEAN,
         defaultValue: true,
         allowNull: false,
      },
      resetToken: {
         type: DataTypes.STRING,
         allowNull: true,
         defaultValue: null,
         field: 'reset_token'
      },
      resetTokenExpiresAt: {
         type: DataTypes.DATE,
         allowNull: true,
         defaultValue: null,
         field: 'reset_token_expires_at'
      },
      image: {
         type: DataTypes.STRING,
         allowNull: true,
         defaultValue: null,
      },
   }, {
      sequelize,
      modelName: 'User',
      tableName: 'users',
   });
   

export default User;
