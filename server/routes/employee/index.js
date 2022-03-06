const express = require('express');
const router = express.Router();

// 员工信息
const employee = require('./employee');

router.use('/', employee);

module.exports = router;
