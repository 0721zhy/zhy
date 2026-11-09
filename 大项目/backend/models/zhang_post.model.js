// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：微博（信息流 / 发布 / 删除）与点赞

const zhang_pool = require('./zhang_pool');

// 微博基础查询片段：联表带出作者信息，并计算当前用户是否已点赞
const ZHANG_POST_FIELDS =
    'p.zhang_id, p.zhang_user_id, p.zhang_content, p.zhang_image, ' +
    'p.zhang_reposts, p.zhang_comments, p.zhang_likes, p.zhang_created_at, ' +
    'u.zhang_nickname, u.zhang_avatar, u.zhang_bio, ' +
    '(CASE WHEN l.zhang_id IS NULL THEN 0 ELSE 1 END) AS zhang_liked ';

// 查询微博列表
// zhang_userId  非空 → 只查该用户的微博（个人主页）
// zhang_onlyFollowing = 1 → 只查当前用户关注的人 + 自己（首页"关注"流）
async function zhangFindPosts(zhang_meId, zhang_userId, zhang_onlyFollowing) {
    let zhang_sql =
        'SELECT ' + ZHANG_POST_FIELDS +
        'FROM zhang_posts p ' +
        'JOIN zhang_users u ON p.zhang_user_id = u.zhang_id ' +
        'LEFT JOIN zhang_likes l ON l.zhang_post_id = p.zhang_id AND l.zhang_user_id = ? ' +
        'WHERE 1=1';
    const zhang_params = [zhang_meId];

    if (zhang_userId) {
        zhang_sql += ' AND p.zhang_user_id = ?';
        zhang_params.push(zhang_userId);
    }
    if (zhang_onlyFollowing === '1') {
        zhang_sql += ' AND (p.zhang_user_id = ? OR p.zhang_user_id IN ' +
            '(SELECT zhang_followee_id FROM zhang_follows WHERE zhang_follower_id = ?))';
        zhang_params.push(zhang_meId, zhang_meId);
    }
    zhang_sql += ' ORDER BY p.zhang_created_at DESC';

    const [zhang_rows] = await zhang_pool.query(zhang_sql, zhang_params);
    return zhang_rows;
}

// 新增微博，返回插入 ID
async function zhangInsertPost(zhang_post) {
    const [zhang_result] = await zhang_pool.query(
        'INSERT INTO zhang_posts (zhang_user_id, zhang_content, zhang_image) VALUES (?, ?, ?)',
        [zhang_post.zhang_user_id, zhang_post.zhang_content, zhang_post.zhang_image || '']
    );
    return zhang_result.insertId;
}

// 按 ID 查询单条微博
async function zhangFindPostById(zhang_id, zhang_meId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT ' + ZHANG_POST_FIELDS +
        'FROM zhang_posts p ' +
        'JOIN zhang_users u ON p.zhang_user_id = u.zhang_id ' +
        'LEFT JOIN zhang_likes l ON l.zhang_post_id = p.zhang_id AND l.zhang_user_id = ? ' +
        'WHERE p.zhang_id = ?',
        [zhang_meId, zhang_id]
    );
    return zhang_rows[0] || null;
}

// 删除微博（同时清掉关联评论与点赞）
async function zhangDeletePost(zhang_id) {
    await zhang_pool.query('DELETE FROM zhang_comments WHERE zhang_post_id = ?', [zhang_id]);
    await zhang_pool.query('DELETE FROM zhang_likes WHERE zhang_post_id = ?', [zhang_id]);
    const [zhang_result] = await zhang_pool.query('DELETE FROM zhang_posts WHERE zhang_id = ?', [zhang_id]);
    return zhang_result.affectedRows;
}

// 切换点赞状态，返回 {zhang_liked, zhang_likes}
async function zhangToggleLike(zhang_postId, zhang_userId) {
    const [zhang_exist] = await zhang_pool.query(
        'SELECT zhang_id FROM zhang_likes WHERE zhang_post_id = ? AND zhang_user_id = ?',
        [zhang_postId, zhang_userId]
    );
    if (zhang_exist.length > 0) {
        await zhang_pool.query('DELETE FROM zhang_likes WHERE zhang_id = ?', [zhang_exist[0].zhang_id]);
        await zhang_pool.query(
            'UPDATE zhang_posts SET zhang_likes = zhang_likes - 1 WHERE zhang_id = ? AND zhang_likes > 0',
            [zhang_postId]
        );
    } else {
        await zhang_pool.query(
            'INSERT INTO zhang_likes (zhang_post_id, zhang_user_id) VALUES (?, ?)',
            [zhang_postId, zhang_userId]
        );
        await zhang_pool.query(
            'UPDATE zhang_posts SET zhang_likes = zhang_likes + 1 WHERE zhang_id = ?',
            [zhang_postId]
        );
    }
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_likes FROM zhang_posts WHERE zhang_id = ?', [zhang_postId]
    );
    return {
        zhang_liked: zhang_exist.length > 0 ? 0 : 1,
        zhang_likes: zhang_rows.length > 0 ? zhang_rows[0].zhang_likes : 0
    };
}

// 查询某微博作者 ID（用于给作者发消息）
async function zhangFindPostOwner(zhang_postId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_user_id FROM zhang_posts WHERE zhang_id = ?', [zhang_postId]
    );
    return zhang_rows.length > 0 ? zhang_rows[0].zhang_user_id : null;
}

module.exports = {
    zhangFindPosts,
    zhangInsertPost,
    zhangFindPostById,
    zhangDeletePost,
    zhangToggleLike,
    zhangFindPostOwner
};
