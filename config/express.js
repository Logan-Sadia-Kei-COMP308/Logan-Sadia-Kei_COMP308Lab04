// load the dependencies
const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const compress = require('compression');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

// define Express configuration method
module.exports = function () {
    // create an Express application instance
    const app = express();

    // use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    // use the 'body-parser' and 'method-override' middleware functions
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(methodOverride());

    // Configure the 'session' middleware
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(cookieParser('secret'));

    app.use(session({
        cookie: {
            maxAge: 60000
        }
    }));

    app.use(flash());

    // set the application view engine and 'views' folder
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // load the routers
    require('../app/routes/index.server.routes.js')(app);

    // static assets
    app.use(express.static('./public'));

    // return the enstance
    return app;
};