// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 科技新闻列表页逻辑：加载分类与新闻，展示接口连接状态（成功/失败、条数、耗时）

(function () {
    'use strict';

    const zhang_list = document.querySelector('#zhang_newsList');
    const zhang_tip = document.querySelector('#zhang_tip');
    const zhang_search = document.querySelector('#zhang_newsSearch');
    const zhang_cate = document.querySelector('#zhang_newsCate');
    const zhang_apiState = document.querySelector('#zhang_apiState');
    const zhang_apiCount = document.querySelector('#zhang_apiCount');
    const zhang_apiMs = document.querySelector('#zhang_apiMs');

    function zhangShowTip(zhang_text, zhang_type) {
        zhang_tip.textContent = zhang_text;
        zhang_tip.className = 'zhang_tip zhang_tip--' + zhang_type;
    }
    function zhangHideTip() { zhang_tip.className = 'zhang_tip'; }

    /* 时间格式化：交给 zhang_common.js 中的 zhangFormatTime（按浏览器本地时区显示） */
    const zhangTime = zhangFormatTime;

    /* 分类下拉 */
    async function zhangLoadCategories() {
        try {
            const zhang_cates = await zhangApi('GET', '/api/news/categories');
            zhang_cate.innerHTML = '<option value="">全部分类</option>' +
                zhang_cates.map(function (zhang_c) {
                    return '<option value="' + zhangEscape(zhang_c) + '">' + zhangEscape(zhang_c) + '</option>';
                }).join('');
        } catch (zhang_err) {
            console.error('[新闻分类加载失败]', zhang_err);
        }
    }

    /* 新闻列表 + 接口连接状态 */
    async function zhangLoadNews() {
        zhang_apiState.className = 'zhang_api-state--err';
        zhang_apiState.textContent = '请求中…';
        zhang_apiCount.textContent = '-';
        zhang_apiMs.textContent = '-';

        const zhang_params = new URLSearchParams();
        if (zhang_search.value.trim()) { zhang_params.set('keyword', zhang_search.value.trim()); }
        if (zhang_cate.value) { zhang_params.set('category', zhang_cate.value); }
        const zhang_url = '/api/news' + (zhang_params.toString() ? '?' + zhang_params : '');

        const zhang_start = performance.now();
        try {
            const zhang_resp = await fetch(zhang_url);
            const zhang_result = await zhang_resp.json();
            const zhang_ms = Math.round(performance.now() - zhang_start);

            if (zhang_result.code !== 0) {
                throw new Error(zhang_result.msg || '接口返回失败');
            }

            const zhang_news = zhang_result.data || [];
            console.log('[科技新闻] 接口连接成功', zhang_url, zhang_result);

            // 连接状态条：成功
            zhang_apiState.className = 'zhang_api-state--ok';
            zhang_apiState.textContent = '连接成功';
            zhang_apiCount.textContent = zhang_news.length + ' 条';
            zhang_apiMs.textContent = zhang_ms + ' ms';
            zhangHideTip();

            if (zhang_news.length === 0) {
                zhang_list.innerHTML = '<div class="zhang_card">没有符合条件的新闻</div>';
                return;
            }

            zhang_list.innerHTML = zhang_news.map(function (zhang_n) {
                return '<a class="zhang_news-item" href="news-detail.html?id=' + zhang_n.zhang_id + '">' +
                    '<div class="zhang_news-meta">' +
                        '<span class="zhang_tag">' + zhangEscape(zhang_n.zhang_category) + '</span>' +
                        '<span>' + zhangEscape(zhang_n.zhang_source) + '</span>' +
                        '<span>' + zhangTime(zhang_n.zhang_publish_time) + '</span>' +
                    '</div>' +
                    '<h3>' + zhangEscape(zhang_n.zhang_title) + '</h3>' +
                    '<p>' + zhangEscape(zhang_n.zhang_summary) + '</p>' +
                    '<div class="zhang_news-foot">' +
                        '<span>点击查看全文</span>' +
                        '<span><i class="iconfont icon-xinxi"></i> ' + zhang_n.zhang_views + ' 次浏览</span>' +
                    '</div>' +
                '</a>';
            }).join('');
        } catch (zhang_err) {
            const zhang_ms = Math.round(performance.now() - zhang_start);
            console.error('[科技新闻] 接口连接失败', zhang_url, zhang_err);

            // 连接状态条：失败
            zhang_apiState.className = 'zhang_api-state--err';
            zhang_apiState.textContent = '连接失败';
            zhang_apiCount.textContent = '0 条';
            zhang_apiMs.textContent = zhang_ms + ' ms';

            zhangShowTip('接口请求失败：' + zhang_err.message, 'error');
            zhang_list.innerHTML = '<div class="zhang_card">数据加载失败，请确认后端服务（http://localhost:521）已启动，或该接口返回异常。</div>';
        }
    }

    /* 搜索防抖 */
    let zhang_timer = null;
    zhang_search.addEventListener('input', function () {
        clearTimeout(zhang_timer);
        zhang_timer = setTimeout(zhangLoadNews, 300);
    });
    zhang_cate.addEventListener('change', zhangLoadNews);

    zhangLoadCategories();
    zhangLoadNews();
})();
