const express = require('express');
const cors = require('cors');

const bfhlRoutes = require('./routes/bfhl.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/bfhl', bfhlRoutes);

module.exports = app;