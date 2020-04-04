// load index controller
const index = require('../controllers/index.server.controller');

// define router method
module.exports = (app) => {
    // home
    app.get('/', index.render);

    // submit_iris
    app.route('/submit_iris')
        .get(index.render)
        .post(index.submitIris);
};
