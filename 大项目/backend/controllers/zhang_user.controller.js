// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 控制器层：用户 / 关注接口

const zhang_userModel = require('../models/zhang_user.model');
const zhang_msgModel = require('../models/zhang_message.model');

// GET /api/users/recommend?me=1  推荐关注
async function zhangGetRecommend(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_userModel.zhangFindRecommend(zhang_req.query.me || 0);
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询推荐关注失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询推荐关注失败：' + zhang_err.message, data: null });
    }
}

// GET /api/users/:id?me=1  用户主页信息
async function zhangGetUser(zhang_req, zhang_res) {
    try {
        const zhang_user = await zhang_userModel.zhangFindUserById(
            zhang_req.params.id, zhang_req.query.me || 0
        );
        if (!zhang_user) {
            return zhang_res.json({ code: 404, msg: '用户不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_user });
    } catch (zhang_err) {
        console.error('[查询用户失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询用户失败：' + zhang_err.message, data: null });
    }
}

// GET /api/users/:id/follows?type=following|followers  关注 / 粉丝列表
async function zhangGetFollows(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_userModel.zhangFindFollowList(
            zhang_req.params.id, zhang_req.query.type || 'following'
        );
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询关注列表失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询关注列表失败：' + zhang_err.message, data: null });
    }
}

// POST /api/users/:id/follow  { zhang_me: 1 }  切换关注状态
async function zhangToggleFollow(zhang_req, zhang_res) {
    try {
        const zhang_meId = (zhang_req.body && zhang_req.body.zhang_me) || 0;
        const zhang_targetId = Number(zhang_req.params.id);
        if (!zhang_meId) {
            return zhang_res.json({ code: 400, msg: '缺少当前用户标识 zhang_me', data: null });
        }
        if (zhang_meId === zhang_targetId) {
            return zhang_res.json({ code: 400, msg: '不能关注自己', data: null });
        }
        const zhang_result = await zhang_userModel.zhangToggleFollow(zhang_meId, zhang_targetId);

        // 新关注时给对方发一条通知消息
        if (zhang_result.zhang_followed === 1) {
            const zhang_me = await zhang_userModel.zhangFindUserById(zhang_meId, 0);
            await zhang_msgModel.zhangInsertMessage(
                zhang_targetId, 'follow', (zhang_me ? zhang_me.zhang_nickname : '有人') + ' 关注了你'
            );
        }
        zhang_res.json({ code: 0, msg: zhang_result.zhang_followed === 1 ? '关注成功' : '已取消关注', data: zhang_result });
    } catch (zhang_err) {
        console.error('[关注操作失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '关注操作失败：' + zhang_err.message, data: null });
    }
}

module.exports = { zhangGetRecommend, zhangGetUser, zhangGetFollows, zhangToggleFollow };
