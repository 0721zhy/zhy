// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 图书详情页逻辑：从 URL 读取 id 参数，调用 GET /api/books/:id 渲染详情

(function () {
    'use strict';

    const zhang_tip = document.querySelector('#zhang_tip');

    function zhangShowTip(zhang_text, zhang_type) {
        zhang_tip.textContent = zhang_text;
        zhang_tip.className = 'zhang_tip zhang_tip--' + zhang_type;
    }

    function zhangHideTip() {
        zhang_tip.className = 'zhang_tip';
    }

    async function zhangLoadDetail() {
        // 从 URL 读取 id 参数（列表页通过 book-detail.html?id=x 跳转）
        const zhang_id = new URLSearchParams(location.search).get('id');
        if (!zhang_id) {
            zhangShowTip('缺少图书 ID 参数，请从图书列表进入', 'error');
            return;
        }

        zhangShowTip('正在加载图书详情…', 'loading');
        try {
            const zhang_b = await zhangApi('GET', '/api/books/' + zhang_id);

            document.title = zhang_b.zhang_title + ' · 图书详情';
            document.querySelector('#zhang_dCoverTitle').textContent = zhang_b.zhang_title;
            document.querySelector('#zhang_dTitle').textContent = zhang_b.zhang_title;
            document.querySelector('#zhang_dAuthor').textContent = zhang_b.zhang_author;
            document.querySelector('#zhang_dCate').innerHTML =
                '<span class="zhang_tag">' + zhangEscape(zhang_b.zhang_category_name) + '</span>';
            document.querySelector('#zhang_dPrice').textContent = '¥ ' + Number(zhang_b.zhang_price).toFixed(2);
            document.querySelector('#zhang_dStock').textContent = zhang_b.zhang_stock + ' 本' +
                (zhang_b.zhang_stock < 20 ? '（库存偏低）' : '');
            document.querySelector('#zhang_dPress').textContent = zhang_b.zhang_press || '-';
            document.querySelector('#zhang_dDate').textContent = zhang_b.zhang_pub_date
                ? String(zhang_b.zhang_pub_date).slice(0, 10) : '-';
            document.querySelector('#zhang_dCreated').textContent = zhang_b.zhang_created_at
                ? String(zhang_b.zhang_created_at).replace('T', ' ').slice(0, 19) : '-';
            zhangHideTip();
        } catch (zhang_err) {
            zhangShowTip('详情加载失败：' + zhang_err.message, 'error');
        }
    }

    zhangLoadDetail();
})();
