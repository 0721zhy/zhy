// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 数据模型层：科技新闻查询（复用 zhang_book.model 中导出的连接池）

const zhang_pool = require('./zhang_book.model').zhang_pool;

// 查询新闻列表（支持关键词与分类筛选，不返回正文以减少传输量）
async function zhangFindNews(zhang_keyword, zhang_category) {
    let zhang_sql =
        'SELECT zhang_id, zhang_title, zhang_summary, zhang_source, zhang_category, ' +
        '       zhang_publish_time, zhang_views ' +
        'FROM zhang_news WHERE 1=1';
    const zhang_params = [];

    if (zhang_keyword) {
        zhang_sql += ' AND (zhang_title LIKE ? OR zhang_summary LIKE ?)';
        zhang_params.push('%' + zhang_keyword + '%', '%' + zhang_keyword + '%');
    }
    if (zhang_category) {
        zhang_sql += ' AND zhang_category = ?';
        zhang_params.push(zhang_category);
    }
    zhang_sql += ' ORDER BY zhang_publish_time DESC';

    const [zhang_rows] = await zhang_pool.query(zhang_sql, zhang_params);
    return zhang_rows;
}

// 查询全部分类（用于筛选下拉）
async function zhangFindNewsCategories() {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT DISTINCT zhang_category FROM zhang_news ORDER BY zhang_category'
    );
    return zhang_rows.map(function (zhang_r) { return zhang_r.zhang_category; });
}

// 按 ID 查询单条新闻（同时浏览量 +1）
async function zhangFindNewsById(zhang_id) {
    await zhang_pool.query('UPDATE zhang_news SET zhang_views = zhang_views + 1 WHERE zhang_id = ?', [zhang_id]);
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_id, zhang_title, zhang_summary, zhang_content, zhang_source, ' +
        '       zhang_category, zhang_publish_time, zhang_views, zhang_created_at ' +
        'FROM zhang_news WHERE zhang_id = ?',
        [zhang_id]
    );
    return zhang_rows[0] || null;
}

module.exports = { zhangFindNews, zhangFindNewsCategories, zhangFindNewsById };
