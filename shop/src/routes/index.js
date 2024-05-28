const newsRouter = require('./news');
const userRouter = require('./User');
const adminRouter = require('./admin');

function route(app){
    app.use('/', newsRouter);
    app.use('/', userRouter);
    app.use('/', adminRouter);
}

module.exports = route;