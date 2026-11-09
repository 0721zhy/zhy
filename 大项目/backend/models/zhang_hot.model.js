// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：热搜榜

const zhang_pool = require('./zhang_pool');

// 查询热搜榜（按排名升序）
async function zhangFindHot() {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_id, zhang_keyword, zhang_heat, zhang_tag, zhang_rank ' +
        'FROM zhang_hot_search ORDER BY zhang_rank ASC'
    );
    return zhang_rows;
}

module.exports = { zhangFindHot };
