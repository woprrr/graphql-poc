const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');

const app = express();

// @TODO dockerize it ?!
const MONGO_URI = 'mongodb://woprrruser:woprrruser@ds247439.mlab.com:47439/woprrrtest';
if (!MONGO_URI) {
  throw new Error('Url mongo invalid...');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, 
{
  useMongoClient:true
});
mongoose.connection
    .once('open', () => console.log('Connected to MongoLab'))
    .on('error', error => console.log('Error to connect MongoLab:', error));

app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  // Set to false for PROD or API integration.
  graphiql: true,
}));

const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
