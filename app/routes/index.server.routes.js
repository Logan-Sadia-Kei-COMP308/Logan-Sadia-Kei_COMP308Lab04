const index = require('../controllers/index.server.controller');

module.exports = (app) => {
    app.get('/', index.render);

    app.route('/submit_iris')
        .get(index.render)
        .post(index.submitIris);
};