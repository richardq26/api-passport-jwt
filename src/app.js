const express = require("express");
const morgan = require('morgan');
const app = express();
require('./database');
require('./auth/auth');
// SETTINGS
app.set("port", process.env.PORT || 3000);

// MIDDLWEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// RUTAS
app.use(require('./routes/index.routes'));


module.exports = app;