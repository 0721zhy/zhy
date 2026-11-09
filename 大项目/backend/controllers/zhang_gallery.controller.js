// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 控制器层：校园图文接口（GET 列表 / GET 标签）

const zhang_galleryModel = require('../models/zhang_gallery.model');

// GET /api/gallery?tag=xx
async function zhangGetGallery(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_galleryModel.zhangFindGallery(zhang_req.query.tag || '');
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询图文失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询图文失败：' + zhang_err.message, data: null });
    }
}

// GET /api/gallery/tags
async function zhangGetGalleryTags(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_galleryModel.zhangFindGalleryTags();
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询图文标签失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询图文标签失败', data: null });
    }
}

module.exports = { zhangGetGallery, zhangGetGalleryTags };
