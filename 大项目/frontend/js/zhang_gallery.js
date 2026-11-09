// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
// 校园图文列表页逻辑：加载标签与图文，展示接口连接状态，点击卡片弹出大图

(function () {
    'use strict';

    const zhang_grid = document.querySelector('#zhang_galleryGrid');
    const zhang_tags = document.querySelector('#zhang_tags');
    const zhang_tip = document.querySelector('#zhang_tip');
    const zhang_apiState = document.querySelector('#zhang_apiState');
    const zhang_apiCount = document.querySelector('#zhang_apiCount');
    const zhang_apiMs = document.querySelector('#zhang_apiMs');
    const zhang_lightbox = document.querySelector('#zhang_lightbox');
    const zhang_lightboxImg = document.querySelector('#zhang_lightboxImg');
    const zhang_lightboxTitle = document.querySelector('#zhang_lightboxTitle');
    const zhang_lightboxDesc = document.querySelector('#zhang_lightboxDesc');
    const zhang_lightboxClose = document.querySelector('#zhang_lightboxClose');

    let zhang_tagNow = '';      // 当前选中的标签
    let zhang_dataNow = [];     // 当前列表数据（供大图预览取用）

    /* 标签筛选栏 */
    async function zhangLoadTags() {
        try {
            const zhang_list = await zhangApi('GET', '/api/gallery/tags');
            zhang_tags.innerHTML = '<button class="zhang_gallery-tag zhang_gallery-tag--on" data-zhy-tag="">全部</button>' +
                zhang_list.map(function (zhang_t) {
                    return '<button class="zhang_gallery-tag" data-zhy-tag="' + zhangEscape(zhang_t) + '">' +
                        zhangEscape(zhang_t) + '</button>';
                }).join('');
        } catch (zhang_err) {
            console.error('[图文标签加载失败]', zhang_err);
        }
    }

    /* 图文列表 + 接口连接状态 */
    async function zhangLoadGallery() {
        zhang_apiState.className = 'zhang_bad';
        zhang_apiState.textContent = '请求中…';

        const zhang_url = '/api/gallery' + (zhang_tagNow ? '?tag=' + encodeURIComponent(zhang_tagNow) : '');
        const zhang_start = performance.now();
        try {
            const zhang_resp = await fetch(zhang_url);
            const zhang_result = await zhang_resp.json();
            const zhang_ms = Math.round(performance.now() - zhang_start);

            if (zhang_result.code !== 0) {
                throw new Error(zhang_result.msg || '接口返回失败');
            }

            zhang_dataNow = zhang_result.data || [];
            console.log('[校园图文] 接口连接成功', zhang_url, zhang_result);

            zhang_apiState.className = 'zhang_ok';
            zhang_apiState.textContent = '连接成功';
            zhang_apiCount.textContent = zhang_dataNow.length + ' 条';
            zhang_apiMs.textContent = zhang_ms + ' ms';
            zhang_tip.className = 'zhang_tip';

            if (zhang_dataNow.length === 0) {
                zhang_grid.innerHTML = '<div class="zhang_card">没有符合条件的图文</div>';
                return;
            }

            zhang_grid.innerHTML = zhang_dataNow.map(function (zhang_g, zhang_i) {
                return '<article class="zhang_gallery-card" data-zhy-index="' + zhang_i + '">' +
                    '<div class="zhang_gallery-thumb">' +
                        '<span class="zhang_gallery-tagline">' + zhangEscape(zhang_g.zhang_tag) + '</span>' +
                        '<img src="' + zhangEscape(zhang_g.zhang_image) + '" alt="' + zhangEscape(zhang_g.zhang_title) + '" loading="lazy">' +
                    '</div>' +
                    '<div class="zhang_gallery-info">' +
                        '<h3>' + zhangEscape(zhang_g.zhang_title) + '</h3>' +
                        '<p>' + zhangEscape(zhang_g.zhang_desc) + '</p>' +
                        '<div class="zhang_gallery-meta">' +
                            '<span>' + zhangEscape(zhang_g.zhang_place) + '</span>' +
                            '<span>' + zhangFormatTime(zhang_g.zhang_publish_time).slice(0, 10) + '</span>' +
                        '</div>' +
                    '</div>' +
                '</article>';
            }).join('');
        } catch (zhang_err) {
            const zhang_ms = Math.round(performance.now() - zhang_start);
            console.error('[校园图文] 接口连接失败', zhang_url, zhang_err);

            zhang_apiState.className = 'zhang_bad';
            zhang_apiState.textContent = '连接失败';
            zhang_apiCount.textContent = '0 条';
            zhang_apiMs.textContent = zhang_ms + ' ms';

            zhang_tip.textContent = '接口请求失败：' + zhang_err.message;
            zhang_tip.className = 'zhang_tip zhang_tip--error';
            zhang_grid.innerHTML = '<div class="zhang_card">数据加载失败，请确认后端服务已启动。</div>';
        }
    }

    /* 标签点击（事件委托） */
    zhang_tags.addEventListener('click', function (zhang_e) {
        const zhang_btn = zhang_e.target.closest('[data-zhy-tag]');
        if (!zhang_btn) { return; }
        zhang_tagNow = zhang_btn.getAttribute('data-zhy-tag');
        Array.prototype.forEach.call(zhang_tags.children, function (zhang_el) {
            zhang_el.classList.toggle('zhang_gallery-tag--on', zhang_el === zhang_btn);
        });
        zhangLoadGallery();
    });

    /* 卡片点击 → 大图预览 */
    zhang_grid.addEventListener('click', function (zhang_e) {
        const zhang_card = zhang_e.target.closest('[data-zhy-index]');
        if (!zhang_card) { return; }
        const zhang_item = zhang_dataNow[Number(zhang_card.getAttribute('data-zhy-index'))];
        if (!zhang_item) { return; }
        zhang_lightboxImg.src = zhang_item.zhang_image;
        zhang_lightboxTitle.textContent = zhang_item.zhang_title;
        zhang_lightboxDesc.textContent = zhang_item.zhang_desc + '（' + zhang_item.zhang_place + ' · ' +
            zhangFormatTime(zhang_item.zhang_publish_time).slice(0, 10) + '）';
        zhang_lightbox.classList.add('zhang_lightbox--show');
    });

    function zhangCloseLightbox() {
        zhang_lightbox.classList.remove('zhang_lightbox--show');
    }
    zhang_lightboxClose.addEventListener('click', zhangCloseLightbox);
    zhang_lightbox.addEventListener('click', function (zhang_e) {
        if (zhang_e.target === zhang_lightbox) { zhangCloseLightbox(); }
    });
    document.addEventListener('keydown', function (zhang_e) {
        if (zhang_e.key === 'Escape') { zhangCloseLightbox(); }
    });

    zhangLoadTags();
    zhangLoadGallery();
})();
