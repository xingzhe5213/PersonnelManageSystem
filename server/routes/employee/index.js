const express = require('express');
const router = express.Router();

// 员工信息
const employee = require('./employee');
// 员工奖惩
const reward = require('./reward');

router.use('/', employee);
router.use('/reward/', reward);

module.exports = router;
