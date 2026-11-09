// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 公共请求封装：统一调用 /api/ 接口，服务器返回的数据与错误信息输出到浏览器控制台

// file:// 直接打开时给出明确提示（本站需通过 http://localhost:521 访问）
if (location.protocol === 'file:') {
    console.error('[zhang_common] 当前以 file:// 协议打开，接口请求会失败。请通过 http://localhost:521 访问本页面。');
}

/**
 * 通用接口请求
 * @param {string} zhang_method HTTP 方法（GET/POST/PUT/DELETE）
 * @param {string} zhang_url 接口路径（如 /api/books）
 * @param {object|null} zhang_body 请求体（POST/PUT 时传 JSON）
 * @returns {Promise<object>} 后端 data 字段内容；code 非 0 时抛出错误
 */
async function zhangApi(zhang_method, zhang_url, zhang_body) {
    const zhang_options = { method: zhang_method, headers: {} };

    if (zhang_body !== undefined && zhang_body !== null) {
        zhang_options.headers['Content-Type'] = 'application/json; charset=UTF-8';
        zhang_options.body = JSON.stringify(zhang_body);
    }

    try {
        const zhang_resp = await fetch(zhang_url, zhang_options);
        const zhang_result = await zhang_resp.json();

        // 服务器返回的数据输出到控制台
        console.log('[zhangApi 响应]', zhang_method, zhang_url, zhang_result);

        if (zhang_result.code !== 0) {
            // 统一 JSON 格式中的失败信息输出到控制台并抛出
            console.error('[zhangApi 业务错误]', zhang_result.msg);
            throw new Error(zhang_result.msg);
        }
        return zhang_result.data;
    } catch (zhang_err) {
        // 网络层错误（断网、服务未启动等）输出到控制台
        if (zhang_err instanceof TypeError) {
            console.error('[zhangApi 网络错误] 无法连接服务器，请确认后端已启动（http://localhost:521）', zhang_err);
            throw new Error('网络错误：无法连接服务器');
        }
        throw zhang_err;
    }
}

/**
 * HTML 转义，防止数据中的特殊字符破坏页面结构
 */
function zhangEscape(zhang_str) {
    return String(zhang_str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
