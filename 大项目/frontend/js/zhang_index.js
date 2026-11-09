// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 微博首页逻辑：发微博、信息流（全部/关注）、热搜榜、推荐关注、我的信息卡

// 当前信息流 Tab（all / following）
let zhang_curTab = 'all';

/* ---------- 我的信息卡 ---------- */
async function zhangLoadMe() {
    try {
        const zhang_me = await zhangApi('GET', '/api/users/' + ZHANG_CURRENT_USER_ID + '?me=' + ZHANG_CURRENT_USER_ID);
        document.getElementById('zhang_meCard').innerHTML =
            '<div class="zhang_me-top">' +
            '<a href="profile.html?id=' + zhang_me.zhang_id + '">' + zhangAvatarHtml(zhang_me, 'zhang_avatar--64') + '</a>' +
            '<div><div class="zhang_me-name">' + zhangEscape(zhang_me.zhang_nickname) + '</div>' +
            '<div class="zhang_me-bio">' + zhangEscape(zhang_me.zhang_bio) + '</div></div></div>' +
            '<div class="zhang_me-nums">' +
            '<a href="profile.html?id=' + zhang_me.zhang_id + '&tab=follows"><b>' + zhang_me.zhang_following_count + '</b>关注</a>' +
            '<a href="profile.html?id=' + zhang_me.zhang_id + '&tab=fans"><b>' + zhang_me.zhang_follower_count + '</b>粉丝</a>' +
            '<a href="profile.html?id=' + zhang_me.zhang_id + '"><b>' + zhang_me.zhang_post_count + '</b>微博</a>' +
            '</div>';
        document.getElementById('zhang_composerAvatar').innerHTML = zhangAvatarHtml(zhang_me, 'zhang_avatar--40');
    } catch (zhang_err) {
        document.getElementById('zhang_meCard').innerHTML =
            '<div class="zhang_tip zhang_tip--error">信息卡加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/* ---------- 信息流 ---------- */
async function zhangLoadFeed() {
    const zhang_feedTip = document.getElementById('zhang_feedTip');
    zhang_feedTip.className = 'zhang_tip zhang_tip--loading';
    zhang_feedTip.textContent = '微博加载中…';

    try {
        const zhang_url = '/api/posts?me=' + ZHANG_CURRENT_USER_ID +
            (zhang_curTab === 'following' ? '&onlyFollowing=1' : '');
        const zhang_list = await zhangApi('GET', zhang_url);
        zhang_feedTip.className = 'zhang_tip zhang_tip--ok';
        zhang_feedTip.textContent = '接口连接正常，共 ' + zhang_list.length + ' 条微博（表 zhang_posts）';
        zhangRenderPosts(document.getElementById('zhang_feed'), zhang_list);
    } catch (zhang_err) {
        zhang_feedTip.className = 'zhang_tip zhang_tip--error';
        zhang_feedTip.textContent = '微博加载失败：' + zhang_err.message;
        document.getElementById('zhang_feed').innerHTML = '';
    }
}

/* ---------- 发微博 ---------- */
function zhangInitComposer() {
    const zhang_box = document.getElementById('zhang_composer');
    const zhang_pick = document.getElementById('zhang_imagePick');
    const zhang_preview = document.getElementById('zhang_preview');
    const zhang_count = document.getElementById('zhang_count');
    const zhang_tip = document.getElementById('zhang_pubTip');

    // 字数统计
    zhang_box.addEventListener('input', function () {
        const zhang_len = zhang_box.value.length;
        zhang_count.textContent = zhang_len + ' / 500';
        zhang_count.classList.toggle('zhang_composer-count--warn', zhang_len > 480);
    });

    // 配图预览
    zhang_pick.addEventListener('change', function () {
        if (zhang_pick.value) {
            zhang_preview.src = zhang_pick.value;
            zhang_preview.style.display = 'block';
        } else {
            zhang_preview.style.display = 'none';
        }
    });

    // 发布
    document.getElementById('zhang_publishBtn').addEventListener('click', async function () {
        const zhang_content = zhang_box.value.trim();
        if (!zhang_content) {
            zhang_tip.className = 'zhang_tip zhang_tip--error';
            zhang_tip.textContent = '微博内容不能为空';
            return;
        }
        const zhang_btn = this;
        zhang_btn.disabled = true;
        try {
            await zhangApi('POST', '/api/posts', {
                zhang_user_id: ZHANG_CURRENT_USER_ID,
                zhang_content: zhang_content,
                zhang_image: zhang_pick.value
            });
            zhang_tip.className = 'zhang_tip zhang_tip--ok';
            zhang_tip.textContent = '发布成功！';
            zhang_box.value = '';
            zhang_pick.value = '';
            zhang_preview.style.display = 'none';
            zhang_count.textContent = '0 / 500';
            zhangLoadFeed();
            zhangLoadMe();
        } catch (zhang_err) {
            zhang_tip.className = 'zhang_tip zhang_tip--error';
            zhang_tip.textContent = '发布失败：' + zhang_err.message;
        } finally {
            zhang_btn.disabled = false;
        }
    });
}

/* ---------- 热搜榜 ---------- */
async function zhangLoadHot() {
    try {
        const zhang_rows = await zhangApi('GET', '/api/hot');
        const zhang_cls = { '新': ' zhang_hot-tag--xin', '沸': ' zhang_hot-tag--fei', '热': ' zhang_hot-tag--re' };
        document.getElementById('zhang_hotList').innerHTML = zhang_rows.map(function (zhang_h) {
            return '<div class="zhang_hot-item">' +
                '<span class="zhang_hot-no">' + zhang_h.zhang_rank + '</span>' +
                '<span class="zhang_hot-word">' + zhangEscape(zhang_h.zhang_keyword) + '</span>' +
                (zhang_h.zhang_tag ? '<span class="zhang_hot-tag' + (zhang_cls[zhang_h.zhang_tag] || '') + '">' +
                    zhangEscape(zhang_h.zhang_tag) + '</span>' : '') +
                '<span class="zhang_hot-heat">' + zhang_h.zhang_heat.toLocaleString() + '</span>' +
                '</div>';
        }).join('');
    } catch (zhang_err) {
        document.getElementById('zhang_hotList').innerHTML =
            '<div class="zhang_tip zhang_tip--error">热搜加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/* ---------- 推荐关注 ---------- */
async function zhangLoadRecommend() {
    const zhang_box = document.getElementById('zhang_recList');
    try {
        const zhang_rows = await zhangApi('GET', '/api/users/recommend?me=' + ZHANG_CURRENT_USER_ID);
        if (!zhang_rows.length) {
            zhang_box.innerHTML = '<div class="zhang_empty">已关注所有用户</div>';
            return;
        }
        zhang_box.innerHTML = zhang_rows.map(function (zhang_u) {
            return '<div class="zhang_rec-item" data-uid="' + zhang_u.zhang_id + '">' +
                '<a href="profile.html?id=' + zhang_u.zhang_id + '">' + zhangAvatarHtml(zhang_u, 'zhang_avatar--34') + '</a>' +
                '<div class="zhang_rec-main">' +
                '<div class="zhang_rec-name">' + zhangEscape(zhang_u.zhang_nickname) + '</div>' +
                '<div class="zhang_rec-bio">' + zhangEscape(zhang_u.zhang_bio) + '</div></div>' +
                '<button class="zhang_btn zhang_btn--ghost zhang_btn--sm"><i class="iconfont icon-guanzhu"></i>关注</button>' +
                '</div>';
        }).join('');

        // 关注按钮事件（关注后从推荐列表移除并刷新信息流）
        zhang_box.addEventListener('click', async function (zhang_ev) {
            const zhang_btn = zhang_ev.target.closest('.zhang_btn');
            if (!zhang_btn) { return; }
            const zhang_item = zhang_btn.closest('.zhang_rec-item');
            try {
                await zhangApi('POST', '/api/users/' + zhang_item.dataset.uid + '/follow',
                    { zhang_me: ZHANG_CURRENT_USER_ID });
                zhang_item.remove();
                if (!zhang_box.querySelector('.zhang_rec-item')) {
                    zhang_box.innerHTML = '<div class="zhang_empty">已关注所有用户</div>';
                }
                zhangLoadFeed();
            } catch (zhang_err) {
                alert('关注失败：' + zhang_err.message);
            }
        });
    } catch (zhang_err) {
        zhang_box.innerHTML = '<div class="zhang_tip zhang_tip--error">推荐加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function () {
    zhangLoadMe();
    zhangLoadFeed();
    zhangLoadHot();
    zhangLoadRecommend();
    zhangInitComposer();
    zhangLoadNavBadge();

    // 微博卡片交互（点赞/评论/删除）
    zhangBindFeedEvents(document.getElementById('zhang_feed'), function () {
        zhangLoadMe();
    });

    // 信息流 Tab 切换
    document.querySelectorAll('.zhang_tab').forEach(function (zhang_tab) {
        zhang_tab.addEventListener('click', function () {
            if (zhang_tab.dataset.tab === zhang_curTab) { return; }
            zhang_curTab = zhang_tab.dataset.tab;
            document.querySelectorAll('.zhang_tab').forEach(function (zhang_t) {
                zhang_t.classList.toggle('zhang_tab--on', zhang_t === zhang_tab);
            });
            zhangLoadFeed();
        });
    });
});
