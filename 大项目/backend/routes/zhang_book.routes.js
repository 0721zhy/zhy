// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 路由层：图书 RESTful 接口 /api/books

const zhang_router = require('express').Router();
const zhang_ctrl = require('../controllers/zhang_book.controller');

zhang_router.get('/', zhang_ctrl.zhangGetBooks);              // 列表（支持 keyword/categoryId 筛选）
zhang_router.get('/:id', zhang_ctrl.zhangGetBookDetail);      // 详情
zhang_router.post('/', zhang_ctrl.zhangCreateBook);           // 新增
zhang_router.put('/:id', zhang_ctrl.zhangModifyBook);         // 更新
zhang_router.delete('/:id', zhang_ctrl.zhangRemoveBook);      // 删除

module.exports = zhang_router;
