import { Sequelize, DataTypes, Model } from 'sequelize'; 
import 'ts-node/register';
import { DATABASE_URL } from './config';
import { Umzug, SequelizeStorage } from "umzug";

export const sequelize = new Sequelize(DATABASE_URL, {
   dialect: 'postgres',
   dialectOptions: {
      ssl: process.env.DATABASE_SSL === 'true' ? {
         require: true,
         rejectUnauthorized: false,
      } : false,
   },
});

const migrationConf = {
   migrations: {
      glob: 'src/migrations/*.js',
   },
   storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
   context: sequelize.getQueryInterface(),
   logger: console,
};

const runMigrations = async () => {
   const migrator = new Umzug(migrationConf);
   const migrations = await migrator.up();
   console.log('Migrations up to date', {
      files: migrations.map((mig) => mig.name),
   });
};

export const connectToDatabase = async () => {
   try {
      await sequelize.authenticate();
      await runMigrations();
      console.log('connected to the database');
   } catch (err) {
      console.log('failed to connect to the database: ', err);
      return process.exit(1);
   }
   return null;
};

export const rollbackMigration = async () => {
   await sequelize.authenticate();
   const migrator = new Umzug(migrationConf);
   await migrator.down();
};

export const DB = {
   sequelize,
   DataTypes,
   Model,
};