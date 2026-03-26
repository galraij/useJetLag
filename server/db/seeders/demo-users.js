'use strict';
const bcrypt = require('bcrypt');

module.exports = {
    async up(queryInterface, Sequelize) {
        const hash1 = await bcrypt.hash("admin123", 10);
        const hash2 = await bcrypt.hash("user123", 10);

        await queryInterface.bulkInsert("users", [
            {
                email: "esti@example.com",
                password_hash: hash1,
                name: "Esti Mor",
                role: "admin",
                is_blocked: false,
                created_at: new Date()
            },
            {
                email: "johnd@example.com",
                password_hash: hash2,
                name: "John Doe",
                role: "user",
                is_blocked: false,
                created_at: new Date()
            },
            {
                email: "blocked_user@example.com",
                password_hash: hash2,
                name: "Blocked User",
                role: "user",
                is_blocked: true,
                created_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    }
};