// backend/prisma.config.js
const dotenv = require('dotenv');
const path = require('path');


// Carga el .env que está en la misma carpeta que este archivo
dotenv.config({ path: path.join(__dirname, '.env') });

module.exports = {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};
