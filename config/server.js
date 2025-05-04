// config/server.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const configureServer = (app) => {
  // Sécurité HTTP
  app.use(helmet());

  // Logger des requêtes HTTP
  app.use(morgan('dev'));

  // CORS
  app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  }));

  // Body parser
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
};

module.exports = configureServer;

