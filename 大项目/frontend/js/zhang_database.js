// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 数据库连接测试页逻辑：提交用户名/密码到 POST /api/database/test，展示成功或错误提示

(function () {
    'use strict';

    const zhang_form = document.querySelector('#zhang_dbForm');
    const zhang_result = document.querySelector('#zhang_dbResult');
    const zhang_btn = document.querySelector('#zhang_dbTestBtn');

    /* 渲染成功结果 */
    function zhangShowOk(zhang_data) {
        zhang_result.className = 'zhang_db-result zhang_db-result--ok';
        zhang_result.innerHTML =
            '<h4><i class="iconfont icon-tuijian"></i>连接成功</h4>' +
            '<dl>' +
            '<dt>用户名</dt><dd>' + zhangEscape(zhang_data.zhang_user) + '</dd>' +
            '<dt>主机地址</dt><dd>' + zhangEscape(zhang_data.zhang_host) + '</dd>' +
            '<dt>MySQL 版本</dt><dd>' + zhangEscape(zhang_data.zhang_version) + '</dd>' +
            '<dt>当前数据库</dt><dd>' + zhangEscape(zhang_data.zhang_database) + '</dd>' +
            '</dl>';
    }

    /* 渲染失败结果 */
    function zhangShowErr(zhang_msg, zhang_code) {
        zhang_result.className = 'zhang_db-result zhang_db-result--err';
        zhang_result.innerHTML =
            '<h4><i class="iconfont icon-shanchu"></i>连接失败</h4>' +
            '<div class="zhang_db-err-msg">' + zhangEscape(zhang_msg) + '</div>' +
            (zhang_code ? '<p style="margin-top:8px;font-size:12px;opacity:.8;">MySQL 错误码：' + zhangEscape(zhang_code) + '</p>' : '');
    }

    /* 提交连接测试 */
    zhang_form.addEventListener('submit', async function (zhang_e) {
        zhang_e.preventDefault();

        const zhang_body = {
            zhang_user: document.querySelector('#zhang_dbUser').value.trim(),
            zhang_password: document.querySelector('#zhang_dbPwd').value,
            zhang_host: document.querySelector('#zhang_dbHost').value.trim() || 'localhost',
            zhang_port: Number(document.querySelector('#zhang_dbPort').value) || 3306,
            zhang_database: document.querySelector('#zhang_dbName').value.trim()
        };

        if (!zhang_body.zhang_user) {
            zhangShowErr('用户名不能为空', '');
            return;
        }

        zhang_btn.disabled = true;
        zhang_btn.innerHTML = '<i class="iconfont icon-gengduo"></i>连接中…';

        try {
            const zhang_resp = await fetch('/api/database/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(zhang_body)
            });
            const zhang_resultData = await zhang_resp.json();

            // 结果输出到控制台（成功与失败都记录）
            if (zhang_resultData.code === 0) {
                console.log('[数据库测试] 连接成功', zhang_resultData);
                zhangShowOk(zhang_resultData.data);
            } else {
                console.error('[数据库测试] 连接失败', zhang_resultData);
                zhangShowErr(zhang_resultData.msg, zhang_resultData.data && zhang_resultData.data.zhang_error_code);
            }
        } catch (zhang_err) {
            console.error('[数据库测试] 请求异常', zhang_err);
            zhangShowErr('网络错误：无法连接后端服务（请确认 http://localhost:521 已启动）', '');
        } finally {
            zhang_btn.disabled = false;
            zhang_btn.innerHTML = '<i class="iconfont icon-tianjia"></i>测试连接';
        }
    });

    /* 重置时清空结果面板 */
    document.querySelector('#zhang_dbResetBtn').addEventListener('click', function () {
        zhang_result.className = 'zhang_db-result';
        zhang_result.innerHTML = '';
    });
})();
