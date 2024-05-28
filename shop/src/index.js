const path = require('path');
const express = require('express');
const { engine } = require ('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const cookieParser = require('cookie-parser')
const app = express()
const port = 3000

const db = require('./config/db');
const route = require('./routes');

db.connect();

app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

app.use(express.urlencoded({
  extended: true
}))
app.use(express.json());
app.use(methodOverride('_method'))
app.engine('hbs', engine({
  extname: '.hbs',
  helpers:{
    sum: (a,b) => a+b,
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

app.use(morgan('combined'))

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})