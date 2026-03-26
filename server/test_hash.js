const bcrypt = require('bcryptjs');
const hash = '$2a$10$LMHBKyRPeluDIqT8/3T3bO2Ac3Wwdlc9EyklbjRHonbbVIinp4Cyi';
const passwords = ['123456', 'password', '12345678'];

console.log('--- BCrypt Hash Verification ---');
console.log('Target Hash:', hash);

passwords.forEach(pw => {
  bcrypt.compare(pw, hash).then(res => {
    console.log(`Password "${pw}" matches: ${res}`);
  }).catch(err => {
    console.error(`Error comparing "${pw}":`, err);
  });
});
