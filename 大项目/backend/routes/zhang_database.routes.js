// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 路由层：数据库连接测试 /api/database

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_database.controller');

zhang_router.post('/test', zhang_ctrl.zhangTestConnection);   // 测试数据库连接

module.exports = zhang_router;
