// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：用户 / 关注接口 /api/users

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_user.controller');

zhang_router.get('/recommend', zhang_ctrl.zhangGetRecommend);      // 推荐关注
zhang_router.get('/:id/follows', zhang_ctrl.zhangGetFollows);      // 关注 / 粉丝列表
zhang_router.get('/:id', zhang_ctrl.zhangGetUser);                 // 用户主页信息
zhang_router.post('/:id/follow', zhang_ctrl.zhangToggleFollow);    // 切换关注状态

module.exports = zhang_router;
