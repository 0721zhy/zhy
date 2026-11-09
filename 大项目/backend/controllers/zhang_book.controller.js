// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 控制器层：图书/分类接口处理，统一响应格式 { code, msg, data }，code=0 成功

const zhang_model = require('../models/zhang_book.model');

/* ---------- 分类 ---------- */

// GET /api/categories
async function zhangGetCategories(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_model.zhangFindAllCategories();
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询分类失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询分类失败', data: null });
    }
}

/* ---------- 图书 ---------- */

// GET /api/books?keyword=xx&categoryId=1
async function zhangGetBooks(zhang_req, zhang_res) {
    try {
        const zhang_rows = await zhang_model.zhangFindBooks(
            zhang_req.query.keyword || '',
            zhang_req.query.categoryId || ''
        );
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_rows });
    } catch (zhang_err) {
        console.error('[查询图书失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询图书失败', data: null });
    }
}

// GET /api/books/:id
async function zhangGetBookDetail(zhang_req, zhang_res) {
    try {
        const zhang_book = await zhang_model.zhangFindBookById(zhang_req.params.id);
        if (!zhang_book) {
            return zhang_res.json({ code: 404, msg: '图书不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '查询成功', data: zhang_book });
    } catch (zhang_err) {
        console.error('[查询详情失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '查询详情失败', data: null });
    }
}

// POST /api/books
async function zhangCreateBook(zhang_req, zhang_res) {
    try {
        const zhang_b = zhang_req.body;
        // 服务端必填校验
        if (!zhang_b.zhang_title || !zhang_b.zhang_author || !zhang_b.zhang_category_id) {
            return zhang_res.json({ code: 400, msg: '书名、作者、分类为必填项', data: null });
        }
        const zhang_newId = await zhang_model.zhangInsertBook({
            zhang_title: zhang_b.zhang_title,
            zhang_author: zhang_b.zhang_author,
            zhang_category_id: zhang_b.zhang_category_id,
            zhang_price: zhang_b.zhang_price || 0,
            zhang_stock: zhang_b.zhang_stock || 0,
            zhang_press: zhang_b.zhang_press || '',
            zhang_pub_date: zhang_b.zhang_pub_date
        });
        const zhang_created = await zhang_model.zhangFindBookById(zhang_newId);
        zhang_res.json({ code: 0, msg: '新增成功', data: zhang_created });
    } catch (zhang_err) {
        console.error('[新增图书失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '新增图书失败', data: null });
    }
}

// PUT /api/books/:id
async function zhangModifyBook(zhang_req, zhang_res) {
    try {
        const zhang_b = zhang_req.body;
        if (!zhang_b.zhang_title || !zhang_b.zhang_author || !zhang_b.zhang_category_id) {
            return zhang_res.json({ code: 400, msg: '书名、作者、分类为必填项', data: null });
        }
        const zhang_affected = await zhang_model.zhangUpdateBook(zhang_req.params.id, {
            zhang_title: zhang_b.zhang_title,
            zhang_author: zhang_b.zhang_author,
            zhang_category_id: zhang_b.zhang_category_id,
            zhang_price: zhang_b.zhang_price || 0,
            zhang_stock: zhang_b.zhang_stock || 0,
            zhang_press: zhang_b.zhang_press || '',
            zhang_pub_date: zhang_b.zhang_pub_date
        });
        if (zhang_affected === 0) {
            return zhang_res.json({ code: 404, msg: '图书不存在或未做任何修改', data: null });
        }
        const zhang_updated = await zhang_model.zhangFindBookById(zhang_req.params.id);
        zhang_res.json({ code: 0, msg: '更新成功', data: zhang_updated });
    } catch (zhang_err) {
        console.error('[更新图书失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '更新图书失败', data: null });
    }
}

// DELETE /api/books/:id
async function zhangRemoveBook(zhang_req, zhang_res) {
    try {
        const zhang_affected = await zhang_model.zhangDeleteBook(zhang_req.params.id);
        if (zhang_affected === 0) {
            return zhang_res.json({ code: 404, msg: '图书不存在', data: null });
        }
        zhang_res.json({ code: 0, msg: '删除成功', data: null });
    } catch (zhang_err) {
        console.error('[删除图书失败]', zhang_err.message);
        zhang_res.json({ code: 1, msg: '删除图书失败', data: null });
    }
}

module.exports = {
    zhangGetCategories,
    zhangGetBooks,
    zhangGetBookDetail,
    zhangCreateBook,
    zhangModifyBook,
    zhangRemoveBook
};
