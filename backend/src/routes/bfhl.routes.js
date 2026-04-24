const express = require('express');
const router = express.Router();

const { handleBFHL } = require('../controller/bfhl.controller');

router.post('/', handleBFHL);

module.exports = router;