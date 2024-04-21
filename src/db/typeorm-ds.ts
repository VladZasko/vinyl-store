import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'LocalHostAdmin2693',
  database: 'homework-6',
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migration/*.js'],
});
