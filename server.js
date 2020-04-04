// set the NODE_ENV variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

// load the module dependencies
const configureExpress = require('./config/express');

// create an Express application instance
const app = configureExpress();

// use the application instance to listen to port 3000
app.listen(3000);

// log the server status
console.log('Server running at http://localhost:3000');

// expose the application instance for external usage
module.exports = app;