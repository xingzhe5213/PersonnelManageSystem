const express = require('express');
const router = express.Router();

// 部门信息
const department = require('./department');
// 职位信息
const position = require('./position');
// 职称信息
const joblevel = require('./joblevel');
// 权限信息
const permiss = require('./permiss');
// 权限信息
const admin = require('./admin');

router.use('/base/department/', department);
router.use('/base/position/', position);
router.use('/base/joblevel/', joblevel);
router.use('/base/permiss/', permiss);
router.use('/adm/leader/', admin);

module.exports = router;
