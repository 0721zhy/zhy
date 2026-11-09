// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：用户与关注关系

const zhang_pool = require('./zhang_pool');

// 按 ID 查询用户（附微博数 / 关注数 / 粉丝数 / 我是否已关注他）
async function zhangFindUserById(zhang_id, zhang_meId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_id, zhang_username, zhang_nickname, zhang_avatar, zhang_bio, zhang_created_at ' +
        'FROM zhang_users WHERE zhang_id = ?',
        [zhang_id]
    );
    const zhang_user = zhang_rows[0];
    if (!zhang_user) { return null; }

    // 三个计数字段
    const [zhang_cnt] = await zhang_pool.query(
        'SELECT ' +
        '(SELECT COUNT(*) FROM zhang_posts   WHERE zhang_user_id = ?) AS zhang_post_count, ' +
        '(SELECT COUNT(*) FROM zhang_follows WHERE zhang_follower_id = ?) AS zhang_following_count, ' +
        '(SELECT COUNT(*) FROM zhang_follows WHERE zhang_followee_id = ?) AS zhang_follower_count',
        [zhang_id, zhang_id, zhang_id]
    );
    zhang_user.zhang_post_count = zhang_cnt[0].zhang_post_count;
    zhang_user.zhang_following_count = zhang_cnt[0].zhang_following_count;
    zhang_user.zhang_follower_count = zhang_cnt[0].zhang_follower_count;

    // 当前登录用户是否已关注该用户
    zhang_user.zhang_is_followed = 0;
    if (zhang_meId && Number(zhang_meId) !== Number(zhang_id)) {
        const [zhang_f] = await zhang_pool.query(
            'SELECT zhang_id FROM zhang_follows WHERE zhang_follower_id = ? AND zhang_followee_id = ?',
            [zhang_meId, zhang_id]
        );
        zhang_user.zhang_is_followed = zhang_f.length > 0 ? 1 : 0;
    }
    return zhang_user;
}

// 查询用户的关注 / 粉丝列表
async function zhangFindFollowList(zhang_id, zhang_type) {
    const zhang_sql = zhang_type === 'followers'
        ? 'SELECT u.zhang_id, u.zhang_nickname, u.zhang_avatar, u.zhang_bio ' +
          'FROM zhang_follows f JOIN zhang_users u ON f.zhang_follower_id = u.zhang_id ' +
          'WHERE f.zhang_followee_id = ? ORDER BY f.zhang_created_at DESC'
        : 'SELECT u.zhang_id, u.zhang_nickname, u.zhang_avatar, u.zhang_bio ' +
          'FROM zhang_follows f JOIN zhang_users u ON f.zhang_followee_id = u.zhang_id ' +
          'WHERE f.zhang_follower_id = ? ORDER BY f.zhang_created_at DESC';
    const [zhang_rows] = await zhang_pool.query(zhang_sql, [zhang_id]);
    return zhang_rows;
}

// 推荐关注：当前用户尚未关注的其他用户（按粉丝数排序，最多 5 个）
async function zhangFindRecommend(zhang_meId) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT u.zhang_id, u.zhang_nickname, u.zhang_avatar, u.zhang_bio, ' +
        '(SELECT COUNT(*) FROM zhang_follows WHERE zhang_followee_id = u.zhang_id) AS zhang_follower_count ' +
        'FROM zhang_users u ' +
        'WHERE u.zhang_id <> ? AND u.zhang_id NOT IN ' +
        '(SELECT zhang_followee_id FROM zhang_follows WHERE zhang_follower_id = ?) ' +
        'ORDER BY zhang_follower_count DESC LIMIT 5',
        [zhang_meId, zhang_meId]
    );
    return zhang_rows;
}

// 切换关注状态（已关注则取关，未关注则关注），返回 {zhang_followed, zhang_changed}
async function zhangToggleFollow(zhang_followerId, zhang_followeeId) {
    const [zhang_exist] = await zhang_pool.query(
        'SELECT zhang_id FROM zhang_follows WHERE zhang_follower_id = ? AND zhang_followee_id = ?',
        [zhang_followerId, zhang_followeeId]
    );
    if (zhang_exist.length > 0) {
        await zhang_pool.query('DELETE FROM zhang_follows WHERE zhang_id = ?', [zhang_exist[0].zhang_id]);
        return { zhang_followed: 0, zhang_changed: -1 };
    }
    await zhang_pool.query(
        'INSERT INTO zhang_follows (zhang_follower_id, zhang_followee_id) VALUES (?, ?)',
        [zhang_followerId, zhang_followeeId]
    );
    return { zhang_followed: 1, zhang_changed: 1 };
}

module.exports = { zhangFindUserById, zhangFindFollowList, zhangFindRecommend, zhangToggleFollow };
