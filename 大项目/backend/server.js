// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 服务入口：Express 启动文件，端口 521，托管 frontend/ 静态目录，挂载 /api/ 路由

const zhang_express = require('express');
const zhang_path = require('path');
const zhang_cors = require('cors');

const zhang_app = zhang_express();
const zhang_PORT = 521;

// 全跨域访问
zhang_app.use(zhang_cors());

// 解析 JSON 请求体
zhang_app.use(zhang_express.json());

// express.static 托管 frontend/ 目录（访问 http://localhost:521/ 即入口页）
zhang_app.use(zhang_express.static(zhang_path.join(__dirname, '..', 'frontend')));

// 挂载业务路由（RESTful，统一以 /api/ 为前缀）
zhang_app.use('/api/categories', require('./routes/zhang_category.routes'));
zhang_app.use('/api/books', require('./routes/zhang_book.routes'));
zhang_app.use('/api/database', require('./routes/zhang_database.routes'));
zhang_app.use('/api/news', require('./routes/zhang_news.routes'));

// 统一 404（未匹配的 API 路径）
zhang_app.use('/api', function (zhang_req, zhang_res) {
    zhang_res.status(404).json({ code: 404, msg: '接口不存在：' + zhang_req.originalUrl, data: null });
});

// 全局错误兜底
zhang_app.use(function (zhang_err, zhang_req, zhang_res, zhang_next) {
    console.error('[服务器错误]', zhang_err.message);
    zhang_res.status(500).json({ code: 500, msg: '服务器内部错误', data: null });
});

zhang_app.listen(zhang_PORT, function () {
    console.log('图书管理系统后端已启动：http://localhost:' + zhang_PORT);
});
