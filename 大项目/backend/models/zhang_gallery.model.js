// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 数据模型层：校园图文查询（复用 zhang_book.model 中导出的连接池）

const zhang_pool = require('./zhang_book.model').zhang_pool;

// 查询图文列表（支持标签筛选）
async function zhangFindGallery(zhang_tag) {
    let zhang_sql =
        'SELECT zhang_id, zhang_title, zhang_desc, zhang_image, zhang_place, ' +
        '       zhang_tag, zhang_publish_time ' +
        'FROM zhang_gallery WHERE 1=1';
    const zhang_params = [];

    if (zhang_tag) {
        zhang_sql += ' AND zhang_tag = ?';
        zhang_params.push(zhang_tag);
    }
    zhang_sql += ' ORDER BY zhang_sort ASC, zhang_publish_time DESC';

    const [zhang_rows] = await zhang_pool.query(zhang_sql, zhang_params);
    return zhang_rows;
}

// 查询全部标签
async function zhangFindGalleryTags() {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT DISTINCT zhang_tag FROM zhang_gallery ORDER BY zhang_tag'
    );
    return zhang_rows.map(function (zhang_r) { return zhang_r.zhang_tag; });
}

module.exports = { zhangFindGallery, zhangFindGalleryTags };
