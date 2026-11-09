// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：微博接口 /api/posts（含评论与点赞）

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_post.controller');

zhang_router.get('/', zhang_ctrl.zhangGetPosts);                   // 信息流（me/userId/onlyFollowing 筛选）
zhang_router.post('/', zhang_ctrl.zhangCreatePost);                // 发布微博
zhang_router.get('/:id', zhang_ctrl.zhangGetPost);                 // 微博详情
zhang_router.delete('/:id', zhang_ctrl.zhangDeletePost);           // 删除微博
zhang_router.post('/:id/like', zhang_ctrl.zhangToggleLike);        // 切换点赞
zhang_router.get('/:id/comments', zhang_ctrl.zhangGetComments);    // 评论列表
zhang_router.post('/:id/comments', zhang_ctrl.zhangCreateComment); // 发表评论

module.exports = zhang_router;
