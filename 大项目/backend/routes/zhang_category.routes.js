// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：分类接口 /api/categories

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_book.controller');

zhang_router.get('/', zhang_ctrl.zhangGetCategories);         // 分类列表

module.exports = zhang_router;
