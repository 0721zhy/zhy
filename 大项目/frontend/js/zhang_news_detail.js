// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻详情页逻辑：从 URL 读取 id，请求 GET /api/news/:id 并渲染正文

(function () {
    'use strict';

    const zhang_article = document.querySelector('#zhang_article');
    const zhang_tip = document.querySelector('#zhang_tip');
    const zhang_apiState = document.querySelector('#zhang_apiState');
    const zhang_apiMs = document.querySelector('#zhang_apiMs');

    const zhang_id = new URLSearchParams(location.search).get('id');

    const zhangTime = zhangFormatTime;

    function zhangShowErr(zhang_msg) {
        zhang_apiState.textContent = '请求失败';
        zhang_apiState.style.color = '#c0392b';
        zhang_tip.textContent = zhang_msg;
        zhang_tip.className = 'zhang_tip zhang_tip--error';
        zhang_article.innerHTML = '<div class="zhang_card">' + zhangEscape(zhang_msg) + '</div>';
    }

    async function zhangLoadDetail() {
        if (!zhang_id) {
            zhangShowErr('缺少参数 id，请从新闻列表页进入');
            return;
        }

        const zhang_url = '/api/news/' + zhang_id;
        const zhang_start = performance.now();
        try {
            const zhang_resp = await fetch(zhang_url);
            const zhang_result = await zhang_resp.json();
            const zhang_ms = Math.round(performance.now() - zhang_start);

            if (zhang_result.code !== 0) {
                console.error('[新闻详情] 接口返回失败', zhang_result);
                throw new Error(zhang_result.msg || '接口返回失败');
            }

            const zhang_n = zhang_result.data;
            console.log('[新闻详情] 接口连接成功', zhang_url, zhang_result);

            zhang_apiState.textContent = '连接成功';
            zhang_apiState.style.color = '#1e7e34';
            zhang_apiMs.textContent = zhang_ms + ' ms';
            zhang_tip.className = 'zhang_tip';

            // 正文按换行切分为段落
            const zhang_paras = String(zhang_n.zhang_content).split('\n')
                .filter(function (zhang_p) { return zhang_p.trim(); })
                .map(function (zhang_p) { return '<p>' + zhangEscape(zhang_p) + '</p>'; })
                .join('');

            zhang_article.innerHTML =
                '<h1>' + zhangEscape(zhang_n.zhang_title) + '</h1>' +
                '<div class="zhang_article-meta">' +
                    '<span class="zhang_tag">' + zhangEscape(zhang_n.zhang_category) + '</span>' +
                    '<span>来源：' + zhangEscape(zhang_n.zhang_source) + '</span>' +
                    '<span>发布：' + zhangTime(zhang_n.zhang_publish_time) + '</span>' +
                    '<span>浏览：' + zhang_n.zhang_views + ' 次</span>' +
                    '<span>数据表：zhang_news</span>' +
                '</div>' +
                '<div class="zhang_article-summary">' + zhangEscape(zhang_n.zhang_summary) + '</div>' +
                '<div class="zhang_article-body">' + zhang_paras + '</div>';
        } catch (zhang_err) {
            const zhang_ms = Math.round(performance.now() - zhang_start);
            zhang_apiMs.textContent = zhang_ms + ' ms';
            console.error('[新闻详情] 请求失败', zhang_url, zhang_err);
            zhangShowErr('加载失败：' + zhang_err.message);
        }
    }

    zhangLoadDetail();
})();
