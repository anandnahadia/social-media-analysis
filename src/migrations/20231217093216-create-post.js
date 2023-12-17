'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      postId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      textContent: {
        type: Sequelize.STRING
      },
      numberOfWords: {
        type: Sequelize.INTEGER
      },
      averageWordLength: {
        type: Sequelize.FLOAT
      },
      status: {
        type: Sequelize.ENUM('created', 'enqueued', 'processed'),
        defaultValue: 'created'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  }
};