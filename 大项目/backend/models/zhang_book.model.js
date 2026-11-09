// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 数据模型层：MySQL 连接池与图书/分类查询封装（mysql2/promise）

const zhang_mysql = require('mysql2/promise');
require('dotenv').config();

// 连接池：凭据来自 backend/.env（DB_USER / DB_PASSWORD / DB_HOST / DB_NAME）
const zhang_pool = zhang_mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'zhang_book_db',
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
});

/* ---------- 分类 ---------- */

// 查询全部分类
async function zhangFindAllCategories() {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT zhang_id, zhang_name, zhang_desc, zhang_created_at FROM zhang_categories ORDER BY zhang_id'
    );
    return zhang_rows;
}

/* ---------- 图书 ---------- */

// 查询图书列表（联表取分类名，支持关键词与分类筛选）
async function zhangFindBooks(zhang_keyword, zhang_categoryId) {
    let zhang_sql =
        'SELECT b.zhang_id, b.zhang_title, b.zhang_author, b.zhang_category_id, ' +
        '       c.zhang_name AS zhang_category_name, b.zhang_price, b.zhang_stock, ' +
        '       b.zhang_press, b.zhang_pub_date, b.zhang_created_at ' +
        'FROM zhang_books b JOIN zhang_categories c ON b.zhang_category_id = c.zhang_id WHERE 1=1';
    const zhang_params = [];

    if (zhang_keyword) {
        zhang_sql += ' AND (b.zhang_title LIKE ? OR b.zhang_author LIKE ?)';
        zhang_params.push('%' + zhang_keyword + '%', '%' + zhang_keyword + '%');
    }
    if (zhang_categoryId) {
        zhang_sql += ' AND b.zhang_category_id = ?';
        zhang_params.push(zhang_categoryId);
    }
    zhang_sql += ' ORDER BY b.zhang_id';

    const [zhang_rows] = await zhang_pool.query(zhang_sql, zhang_params);
    return zhang_rows;
}

// 按 ID 查询单本图书
async function zhangFindBookById(zhang_id) {
    const [zhang_rows] = await zhang_pool.query(
        'SELECT b.zhang_id, b.zhang_title, b.zhang_author, b.zhang_category_id, ' +
        '       c.zhang_name AS zhang_category_name, b.zhang_price, b.zhang_stock, ' +
        '       b.zhang_press, b.zhang_pub_date, b.zhang_created_at ' +
        'FROM zhang_books b JOIN zhang_categories c ON b.zhang_category_id = c.zhang_id ' +
        'WHERE b.zhang_id = ?',
        [zhang_id]
    );
    return zhang_rows[0] || null;
}

// 新增图书，返回插入 ID
async function zhangInsertBook(zhang_book) {
    const [zhang_result] = await zhang_pool.query(
        'INSERT INTO zhang_books (zhang_title, zhang_author, zhang_category_id, zhang_price, zhang_stock, zhang_press, zhang_pub_date) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [zhang_book.zhang_title, zhang_book.zhang_author, zhang_book.zhang_category_id,
         zhang_book.zhang_price, zhang_book.zhang_stock, zhang_book.zhang_press, zhang_book.zhang_pub_date || null]
    );
    return zhang_result.insertId;
}

// 按 ID 更新图书，返回受影响行数
async function zhangUpdateBook(zhang_id, zhang_book) {
    const [zhang_result] = await zhang_pool.query(
        'UPDATE zhang_books SET zhang_title = ?, zhang_author = ?, zhang_category_id = ?, ' +
        'zhang_price = ?, zhang_stock = ?, zhang_press = ?, zhang_pub_date = ? WHERE zhang_id = ?',
        [zhang_book.zhang_title, zhang_book.zhang_author, zhang_book.zhang_category_id,
         zhang_book.zhang_price, zhang_book.zhang_stock, zhang_book.zhang_press,
         zhang_book.zhang_pub_date || null, zhang_id]
    );
    return zhang_result.affectedRows;
}

// 按 ID 删除图书，返回受影响行数
async function zhangDeleteBook(zhang_id) {
    const [zhang_result] = await zhang_pool.query(
        'DELETE FROM zhang_books WHERE zhang_id = ?', [zhang_id]
    );
    return zhang_result.affectedRows;
}

module.exports = {
    zhang_pool,
    zhangFindAllCategories,
    zhangFindBooks,
    zhangFindBookById,
    zhangInsertBook,
    zhangUpdateBook,
    zhangDeleteBook
};
