require('dotenv').config();
// Module Dependencies
// -------------------
const express = require('express');
const bodyParser = require('body-parser');
const errorhandler = require('errorhandler');
const http = require('http');
const path = require('path');
const request = require('request');
const routes = require('./routes/index');
const activityRouter = require('./routes/activity');

// EXPRESS CONFIGURATION
const app = express();

// Configure Express
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.raw({ type: 'application/jwt' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express in Development Mode
if ('development' == app.get('env')) {
  app.use(errorhandler());
}

app.get('/', routes.ui);

// Custom Routes for MC
app.post('/journey/save/', activityRouter.save);
app.post('/journey/validate/', activityRouter.validate);
app.post('/journey/publish/', activityRouter.publish);
app.post('/journey/execute/', activityRouter.execute);

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});