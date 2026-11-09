// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 路由层：校园图文接口 /api/gallery

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_gallery.controller');

zhang_router.get('/', zhang_ctrl.zhangGetGallery);  // 列表（tag 筛选）
zhang_router.get('/tags', zhang_ctrl.zhangGetGalleryTags); // 标签列表

module.exports = zhang_router;
