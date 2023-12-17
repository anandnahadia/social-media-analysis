"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = __importDefault(require("../db"));
class Post extends sequelize_1.Model {
}
Post.init({
    postId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    textContent: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    numberOfWords: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    averageWordLength: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('created', 'enqueued', 'processed'),
        allowNull: false,
        defaultValue: 'created',
    },
}, {
    sequelize: db_1.default,
    modelName: 'post',
});
exports.default = Post;
