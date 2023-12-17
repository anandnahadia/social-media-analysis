// src/db.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5433,
  username: 'postgres',
  password: '1234',
  database: 'postgres-db',
  logging: false,
});

export default sequelize;
