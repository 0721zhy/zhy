// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：消息通知接口 /api/messages

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_message.controller');

zhang_router.get('/', zhang_ctrl.zhangGetMessages);    // 消息列表（含未读数）
zhang_router.post('/read', zhang_ctrl.zhangMarkRead);  // 全部标记已读

module.exports = zhang_router;
