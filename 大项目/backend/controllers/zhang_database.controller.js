// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 控制器层：数据库连接测试（按前端提交的用户名/密码临时连接 MySQL，验证凭据可用性）

const zhang_mysql = require('mysql2/promise');

// POST /api/database/test
async function zhangTestConnection(zhang_req, zhang_res) {
    const zhang_b = zhang_req.body || {};
    const zhang_user = (zhang_b.zhang_user || '').trim();

    // 参数校验
    if (!zhang_user) {
        console.error('[数据库测试] 用户名为空');
        return zhang_res.json({ code: 400, msg: '用户名不能为空', data: null });
    }

    let zhang_conn = null;
    try {
        // 使用前端提交的凭据建立临时连接（5 秒超时，避免长时间挂起）
        zhang_conn = await zhang_mysql.createConnection({
            host: zhang_b.zhang_host || 'localhost',
            port: Number(zhang_b.zhang_port) || 3306,
            user: zhang_user,
            password: zhang_b.zhang_password || '',
            database: zhang_b.zhang_database || undefined,
            connectTimeout: 5000
        });

        // 连接成功：取版本号与当前库名作为验证信息
        const [zhang_rows] = await zhang_conn.query(
            'SELECT VERSION() AS zhang_version, DATABASE() AS zhang_db'
        );

        console.log('[数据库测试] 连接成功：' + zhang_user + '@' + (zhang_b.zhang_host || 'localhost'));
        zhang_res.json({
            code: 0,
            msg: '连接成功',
            data: {
                zhang_user: zhang_user,
                zhang_host: zhang_b.zhang_host || 'localhost',
                zhang_version: zhang_rows[0].zhang_version,
                zhang_database: zhang_rows[0].zhang_db || '（未指定数据库）'
            }
        });
    } catch (zhang_err) {
        // 连接失败：把 MySQL 的具体错误信息返回给前端显示
        console.error('[数据库测试] 连接失败：' + zhang_err.code + ' / ' + zhang_err.message);
        zhang_res.json({
            code: 1,
            msg: '连接失败：' + (zhang_err.message || '未知错误'),
            data: { zhang_error_code: zhang_err.code || 'UNKNOWN' }
        });
    } finally {
        if (zhang_conn) {
            try { await zhang_conn.end(); } catch (zhang_e) { /* 关闭失败忽略 */ }
        }
    }
}

module.exports = { zhangTestConnection };
