// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：热搜榜接口 /api/hot

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_hot.controller');

zhang_router.get('/', zhang_ctrl.zhangGetHot);   // 热搜榜

module.exports = zhang_router;
