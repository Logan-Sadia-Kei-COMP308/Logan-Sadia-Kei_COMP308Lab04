// environments
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// dependencies
const configureExpress = require('./config/express');

// express application
const app = configureExpress();

// listen to port 3000
app.listen(3000);

console.log('Server running at http://localhost:3000');

module.exports = app;