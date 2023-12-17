"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/db.ts
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize({
    dialect: 'postgres',
    host: 'localhost', // Update with your PostgreSQL server details
    port: 5433,
    username: 'postgres',
    password: '1234',
    database: 'postgres-db',
    logging: false, // Set to true to see SQL logs
});
exports.default = sequelize;
