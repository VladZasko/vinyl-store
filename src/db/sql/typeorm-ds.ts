import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  database: process.env.SQL_DATABASE,
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/sql/migration/*.js'],
});
