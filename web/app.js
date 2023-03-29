require('dotenv').config();
// Module Dependencies
// -------------------
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const _ = require('lodash');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const routes = require('./routes/index');
const activityRouter = require('./routes/activity');
// const consumers = require('./consumer/queue');
// const { Queues } = require('./queues');
// const logger = require('./utils/logger');
// const amqp = require('amqplib');

// EXPRESS CONFIGURATION
const app = express();

app.use(cors());

app.use((_req, res, next) => {
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.raw({
  type: 'application/jwt',
}));

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('view engine', 'pug');
app.get('/', routes.ui);
app.get('/index.html', routes.ui);
app.get('/config.js', routes.config);
app.get('/config.json', routes.config);

// Custom Routes for MC
app.post('/journey/save', activityRouter.save);
app.post('/journey/stop', activityRouter.stop);
app.post('/journey/validate', activityRouter.validate);
app.post('/journey/publish', activityRouter.publish);
app.post('/journey/execute', activityRouter.execute);

http.createServer(app).listen(app.get('port'), () => {
  // eslint-disable-next-line no-console
  console.log(`Express server listening on port ${app.get('port')}`);
});
