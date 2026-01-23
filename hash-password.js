/* eslint-disable @typescript-eslint/no-require-imports */
const bcrypt = require('bcryptjs');

const password = 'admin123'; // Ganti dengan password yang Anda inginkan
const hashedPassword = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hashed Password:', hashedPassword);
console.log('\nCopy hashed password di atas untuk dimasukkan ke database');
