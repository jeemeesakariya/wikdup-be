const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'wikdup-be',
      version: '1.0.0',
    },
  },
    apis: [
        './src/routes/auth.Routes.js',
        './src/routes/user.Routes.js',
    ], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {swaggerSpec};