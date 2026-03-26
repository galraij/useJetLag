'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("users", [
            {
                // לא שולחים ID - ה-DB ייצור UUID אוטומטית
                email: "esti@example.com",
                password_hash: "$2a$10$aAe0bzxTDHDJPdxppjqt9uaf454uHYn/ngRm11TE8NyFZ13di7vFW",
                name: "Esti Mor",
                role: "admin",
                is_blocked: false,
                created_at: new Date()
            },
            {
                email: "johnd@example.com",
                password_hash: "$2a$10$LMHBKyRPeluDIqT8/3T3bO2Ac3Wwdlc9EyklbjRHonbbVIinp4Cyi",
                name: "John Doe",
                role: "user",
                is_blocked: false,
                created_at: new Date()
            },
            {
                email: "blocked_user@example.com",
                password_hash: "$2a$10$LMHBKyRPeluDIqT8/3T3bO2Ac3Wwdlc9EyklbjRHonbbVIinp4Cyi",
                name: "Blocked User",
                role: "user",
                is_blocked: true, // דוגמה למשתמש חסום לבדיקות
                created_at: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        // מוחק את כל הרשומות מטבלת users במידה ועושים undo ל-seed
        await queryInterface.bulkDelete('users', null, {});
    }
};