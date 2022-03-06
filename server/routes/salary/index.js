const express = require('express');
const router = express.Router();

// 基础工资
const baseSalary = require('./baseSalary');
// 员工基础工资
const staffSalary = require('./staffSalary');

router.use('/baseSalary/', baseSalary);
router.use('/staffSalary/', staffSalary);

module.exports = router;
