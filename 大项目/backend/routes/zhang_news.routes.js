// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 路由层：科技新闻接口 /api/news

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_news.controller');

zhang_router.get('/', zhang_ctrl.zhangGetNews);                    // 列表（keyword/category 筛选）
zhang_router.get('/categories', zhang_ctrl.zhangGetNewsCategories); // 分类列表
zhang_router.get('/:id', zhang_ctrl.zhangGetNewsDetail);           // 详情

module.exports = zhang_router;
