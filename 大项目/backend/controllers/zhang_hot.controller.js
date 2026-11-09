// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 控制器层：热搜榜接口

const zhang_hotModel = require('../models/zhang_hot.model');

// GET /api/hot  热搜榜
async function zhangGetHot(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_hotModel.zhangFindHot();
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询热搜失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询热搜失败：' + zhang_err.message, data: null });
    }
}

module.exports = { zhangGetHot };
