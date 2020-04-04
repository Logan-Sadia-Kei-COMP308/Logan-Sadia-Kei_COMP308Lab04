/** 
 * COMP308Lab04:
 * Date: Apr 5, 2020
 * Author: Sadia Rashid, Logan Junhwi Kim, Kei Mizubuchi
 * 
 * Sadia Rashid
 * - Made index view with CSS and bootstrap
 * - Added TensorFlow to Express
 * - Made Tensorflow work by pair programming
 * 
 * Logan Junhwi Kim
 * - Made result view
 * - Overall designs improvement with JQuery
 * - Made Tensorflow work by pair programming
 * 
 * Kei Mizubuchi:
 * - Implemented Validation
 * - Added comment and refactored the code
 * - Made Tensorflow work by pair programming
 * 
*/
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