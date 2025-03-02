import { Sequelize, DataTypes, Model } from 'sequelize';
import { DATABASE_URL } from './config';
import { Umzug, SequelizeStorage } from 'umzug';

const sequelize = new Sequelize(DATABASE_URL, {
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
};

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    await runMigrations();
    console.log('Connected to the database');
  } catch (err) {
    console.log('Failed to connect to the database: ', err);
    process.exit(1);
  }
  return null;
};

const rollbackMigration = async () => {
  await sequelize.authenticate();
  const migrator = new Umzug(migrationConf);
  await migrator.down();
};

export { sequelize, DataTypes, Model, connectToDatabase, rollbackMigration };