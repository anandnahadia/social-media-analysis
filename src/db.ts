// src/db.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost', // Update with your PostgreSQL server details
  port: 5433,
  username: 'postgres',
  password: '1234',
  database: 'postgres-db',
  logging: false, // Set to true to see SQL logs
});

export default sequelize;
