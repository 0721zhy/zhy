// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 控制器层：科技新闻接口（GET 列表 / GET 详情 / GET 分类）

const zhang_newsModel = require('../models/zhang_news.model');

// GET /api/news?keyword=xx&category=xx
async function zhangGetNews(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_newsModel.zhangFindNews(
            zhang_req.query.keyword || '',
            zhang_req.query.category || ''
        );
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询新闻失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询新闻失败：' + zhang_err.message, data: null });
    }
}

// GET /api/news/categories
async function zhangGetNewsCategories(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_newsModel.zhangFindNewsCategories();
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询新闻分类失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询新闻分类失败', data: null });
    }
}

// GET /api/news/:id
async function zhangGetNewsDetail(zhang_req, zhang_res) {
    try {
        const zhang_news = await zhang_newsModel.zhangFindNewsById(zhang_req.params.id);
        if (!zhang_news) {
            return zhang_res.json({ code: 404, msg: '新闻不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_news });
    } catch (zhang_err) {
        console.error('[查询新闻详情失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询新闻详情失败：' + zhang_err.message, data: null });
    }
}

module.exports = { zhangGetNews, zhangGetNewsCategories, zhangGetNewsDetail };
