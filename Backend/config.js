// config.js
require('dotenv').config();

const config = {
  jwtKey: process.env.JWT_KEY,
  // Add other configuration variables here if needed
};

module.exports = config;
