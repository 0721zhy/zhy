// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：MySQL 连接池（凭据来自 backend/.env，供微博各模型复用）

const zhang_mysql = require('mysql2/promise');
require('dotenv').config();

const zhang_pool = zhang_mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zhang_weibo_db',
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
});

module.exports = zhang_pool;
