// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 控制器层：消息通知接口

const zhang_msgModel = require('../models/zhang_message.model');

// GET /api/messages?userId=1  消息列表（含未读数）
async function zhangGetMessages(zhang_req, zhang_res) {
    try {
        const zhang_userId = zhang_req.query.userId || 0;
        if (!zhang_userId) {
            return zhang_res.json({ code: 400, msg: '缺少用户标识 userId', data: null });
        }
        const zhang_rows = await zhang_msgModel.zhangFindMessages(zhang_userId);
        const zhang_unread = await zhang_msgModel.zhangCountUnread(zhang_userId);
        zhang_res.json({ code: 0, msg: '查询成功', data: { zhang_list: zhang_rows, zhang_unread: zhang_unread } });
    } catch (zhang_err) {
        console.error('[查询消息失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询消息失败：' + zhang_err.message, data: null });
    }
}

// POST /api/messages/read  { zhang_user_id }  全部标记已读
async function zhangMarkRead(zhang_req, zhang_res) {
    try {
        const zhang_userId = (zhang_req.body && zhang_req.body.zhang_user_id) || 0;
        if (!zhang_userId) {
            return zhang_res.json({ code: 400, msg: '缺少用户标识 zhang_user_id', data: null });
        }
        const zhang_affected = await zhang_msgModel.zhangMarkAllRead(zhang_userId);
        zhang_res.json({ code: 0, msg: '已全部标记为已读', data: { zhang_affected: zhang_affected } });
    } catch (zhang_err) {
        console.error('[标记已读失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '标记已读失败：' + zhang_err.message, data: null });
    }
}

module.exports = { zhangGetMessages, zhangMarkRead };
