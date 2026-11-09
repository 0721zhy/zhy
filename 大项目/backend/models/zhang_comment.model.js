// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：微博评论

const zhang_pool = require('./zhang_pool');

// 查询某微博的评论列表（联表带评论人信息）
async function zhangFindComments(zhang_postId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT c.zhang_id, c.zhang_post_id, c.zhang_user_id, c.zhang_content, c.zhang_created_at, ' +
        'u.zhang_nickname, u.zhang_avatar ' +
        'FROM zhang_comments c JOIN zhang_users u ON c.zhang_user_id = u.zhang_id ' +
        'WHERE c.zhang_post_id = ? ORDER BY c.zhang_created_at ASC',
        [zhang_postId]
    );
    return zhang_rows;
}

// 新增评论，返回插入 ID；同时微博评论计数 +1
async function zhangInsertComment(zhang_postId, zhang_userId, zhang_content) {
    const [zhang_result] = await zhang_pool.query(
        'INSERT INTO zhang_comments (zhang_post_id, zhang_user_id, zhang_content) VALUES (?, ?, ?)',
        [zhang_postId, zhang_userId, zhang_content]
    );
    await zhang_pool.query(
        'UPDATE zhang_posts SET zhang_comments = zhang_comments + 1 WHERE zhang_id = ?',
        [zhang_postId]
    );
    return zhang_result.insertId;
}

module.exports = { zhangFindComments, zhangInsertComment };
