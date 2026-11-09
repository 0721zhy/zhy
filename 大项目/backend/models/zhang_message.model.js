// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：消息通知

const zhang_pool = require('./zhang_pool');

// 查询用户的消息列表（按时间倒序）
async function zhangFindMessages(zhang_userId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_id, zhang_user_id, zhang_type, zhang_content, zhang_is_read, zhang_created_at ' +
        'FROM zhang_messages WHERE zhang_user_id = ? ORDER BY zhang_created_at DESC',
        [zhang_userId]
    );
    return zhang_rows;
}

// 用户未读消息数
async function zhangCountUnread(zhang_userId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT COUNT(*) AS zhang_unread FROM zhang_messages WHERE zhang_user_id = ? AND zhang_is_read = 0',
        [zhang_userId]
    );
    return zhang_rows[0].zhang_unread;
}

// 新增一条消息
async function zhangInsertMessage(zhang_userId, zhang_type, zhang_content) {
    await zhang_pool.query(
        'INSERT INTO zhang_messages (zhang_user_id, zhang_type, zhang_content) VALUES (?, ?, ?)',
        [zhang_userId, zhang_type, zhang_content]
    );
}

// 把用户所有未读消息标记为已读，返回受影响行数
async function zhangMarkAllRead(zhang_userId) {
    const [zhang_result] = await zhang_pool.query(
        'UPDATE zhang_messages SET zhang_is_read = 1 WHERE zhang_user_id = ? AND zhang_is_read = 0',
        [zhang_userId]
    );
    return zhang_result.affectedRows;
}

module.exports = { zhangFindMessages, zhangCountUnread, zhangInsertMessage, zhangMarkAllRead };
