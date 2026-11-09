// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 控制器层：微博接口（信息流 / 发布 / 删除 / 点赞 / 评论）

const zhang_postModel = require('../models/zhang_post.model');
const zhang_commentModel = require('../models/zhang_comment.model');
const zhang_userModel = require('../models/zhang_user.model');
const zhang_msgModel = require('../models/zhang_message.model');

// GET /api/posts?me=1&userId=&onlyFollowing=1  信息流
async function zhangGetPosts(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_postModel.zhangFindPosts(
            zhang_req.query.me || 0,
            zhang_req.query.userId || '',
            zhang_req.query.onlyFollowing || ''
        );
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询微博失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询微博失败：' + zhang_err.message, data: null });
    }
}

// POST /api/posts  { zhang_user_id, zhang_content, zhang_image }
async function zhangCreatePost(zhang_req, zhang_res) {
    try {
        const zhang_b = zhang_req.body || {};
        if (!zhang_b.zhang_user_id) {
            return zhang_res.json({ code: 400, msg: '缺少用户标识 zhang_user_id', data: null });
        }
        const zhang_content = (zhang_b.zhang_content || '').trim();
        if (!zhang_content) {
            return zhang_res.json({ code: 400, msg: '微博内容不能为空', data: null });
        }
        if (zhang_content.length > 500) {
            return zhang_res.json({ code: 400, msg: '微博内容不能超过 500 字', data: null });
        }
        const zhang_id = await zhang_postModel.zhangInsertPost({
            zhang_user_id: zhang_b.zhang_user_id,
            zhang_content: zhang_content,
            zhang_image: zhang_b.zhang_image || ''
        });
        const zhang_post = await zhang_postModel.zhangFindPostById(zhang_id, zhang_b.zhang_user_id);
        zhang_res.json({ code: 0, msg: '发布成功', data: zhang_post });
    } catch (zhang_err) {
        console.error('[发布微博失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '发布微博失败：' + zhang_err.message, data: null });
    }
}

// GET /api/posts/:id?me=1  微博详情
async function zhangGetPost(zhang_req, zhang_res) {
    try {
        const zhang_post = await zhang_postModel.zhangFindPostById(
            zhang_req.params.id, zhang_req.query.me || 0
        );
        if (!zhang_post) {
            return zhang_res.json({ code: 404, msg: '微博不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_post });
    } catch (zhang_err) {
        console.error('[查询微博详情失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询微博详情失败：' + zhang_err.message, data: null });
    }
}

// DELETE /api/posts/:id  删除微博
async function zhangDeletePost(zhang_req, zhang_res) {
    try {
        const zhang_affected = await zhang_postModel.zhangDeletePost(zhang_req.params.id);
        if (!zhang_affected) {
            return zhang_res.json({ code: 404, msg: '微博不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '删除成功', data: null });
    } catch (zhang_err) {
        console.error('[删除微博失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '删除微博失败：' + zhang_err.message, data: null });
    }
}

// POST /api/posts/:id/like  { zhang_user_id }  切换点赞
async function zhangToggleLike(zhang_req, zhang_res) {
    try {
        const zhang_userId = (zhang_req.body && zhang_req.body.zhang_user_id) || 0;
        if (!zhang_userId) {
            return zhang_res.json({ code: 400, msg: '缺少用户标识 zhang_user_id', data: null });
        }
        const zhang_result = await zhang_postModel.zhangToggleLike(zhang_req.params.id, zhang_userId);

        // 点赞（非取消）时给作者发一条通知消息
        if (zhang_result.zhang_liked === 1) {
            const zhang_owner = await zhang_postModel.zhangFindPostOwner(zhang_req.params.id);
            if (zhang_owner && Number(zhang_owner) !== Number(zhang_userId)) {
                const zhang_me = await zhang_userModel.zhangFindUserById(zhang_userId, 0);
                await zhang_msgModel.zhangInsertMessage(
                    zhang_owner, 'like', (zhang_me ? zhang_me.zhang_nickname : '有人') + ' 赞了你的微博'
                );
            }
        }
        zhang_res.json({
            code: 0,
            msg: zhang_result.zhang_liked === 1 ? '点赞成功' : '已取消点赞',
            data: zhang_result
        });
    } catch (zhang_err) {
        console.error('[点赞操作失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '点赞操作失败：' + zhang_err.message, data: null });
    }
}

// GET /api/posts/:id/comments  评论列表
async function zhangGetComments(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_commentModel.zhangFindComments(zhang_req.params.id);
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询评论失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询评论失败：' + zhang_err.message, data: null });
    }
}

// POST /api/posts/:id/comments  { zhang_user_id, zhang_content }
async function zhangCreateComment(zhang_req, zhang_res) {
    try {
        const zhang_b = zhang_req.body || {};
        if (!zhang_b.zhang_user_id) {
            return zhang_res.json({ code: 400, msg: '缺少用户标识 zhang_user_id', data: null });
        }
        const zhang_content = (zhang_b.zhang_content || '').trim();
        if (!zhang_content) {
            return zhang_res.json({ code: 400, msg: '评论内容不能为空', data: null });
        }
        const zhang_id = await zhang_commentModel.zhangInsertComment(
            zhang_req.params.id, zhang_b.zhang_user_id, zhang_content
        );

        // 给微博作者发通知消息（自己评论自己的不发）
        const zhang_owner = await zhang_postModel.zhangFindPostOwner(zhang_req.params.id);
        if (zhang_owner && Number(zhang_owner) !== Number(zhang_b.zhang_user_id)) {
            const zhang_me = await zhang_userModel.zhangFindUserById(zhang_b.zhang_user_id, 0);
            await zhang_msgModel.zhangInsertMessage(
                zhang_owner, 'comment',
                (zhang_me ? zhang_me.zhang_nickname : '有人') + ' 评论了你：' + zhang_content.slice(0, 50)
            );
        }
        const zhang_rows = await zhang_commentModel.zhangFindComments(zhang_req.params.id);
        zhang_res.json({ code: 0, msg: '评论成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[发表评论失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '发表评论失败：' + zhang_err.message, data: null });
    }
}

module.exports = {
    zhangGetPosts,
    zhangCreatePost,
    zhangGetPost,
    zhangDeletePost,
    zhangToggleLike,
    zhangGetComments,
    zhangCreateComment
};
