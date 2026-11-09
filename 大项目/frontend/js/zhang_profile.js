// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 个人主页逻辑：用户资料卡、关注/粉丝列表、TA 的微博信息流、关注按钮

// 从 URL 取要查看的用户 ID（默认当前用户）
const zhang_viewId = Number(new URLSearchParams(location.search).get('id')) || ZHANG_CURRENT_USER_ID;

/* ---------- 用户资料卡 ---------- */
async function zhangLoadUser() {
    try {
        const zhang_u = await zhangApi('GET', '/api/users/' + zhang_viewId + '?me=' + ZHANG_CURRENT_USER_ID);
        document.title = '微博 - ' + zhang_u.zhang_nickname + '的主页';
        document.getElementById('zhang_feedTitle').textContent =
            zhang_viewId === ZHANG_CURRENT_USER_ID ? '我的微博' : zhang_u.zhang_nickname + ' 的微博';

        const zhang_isMe = zhang_viewId === ZHANG_CURRENT_USER_ID;
        let zhang_btns = '';
        if (!zhang_isMe) {
            zhang_btns =
                '<button class="zhang_btn' + (Number(zhang_u.zhang_is_followed) === 1 ? ' zhang_btn--ghost' : '') +
                '" id="zhang_followBtn">' +
                '<i class="iconfont icon-guanzhu"></i>' + (Number(zhang_u.zhang_is_followed) === 1 ? '取消关注' : '关注 TA') +
                '</button>';
        }

        document.getElementById('zhang_userCard').innerHTML =
            '<div class="zhang_profile-head">' +
            zhangAvatarHtml(zhang_u, 'zhang_avatar--64') +
            '<div class="zhang_profile-info">' +
            '<div class="zhang_profile-name">' + zhangEscape(zhang_u.zhang_nickname) + '</div>' +
            '<div class="zhang_profile-username">@' + zhangEscape(zhang_u.zhang_username) + '</div>' +
            '<div class="zhang_profile-bio">' + zhangEscape(zhang_u.zhang_bio) + '</div>' +
            '<div class="zhang_profile-meta"><i class="iconfont icon-shouye"></i> 加入微博时间：' +
            zhangFormatTime(zhang_u.zhang_created_at) + '</div>' +
            '</div>' +
            '<div class="zhang_profile-btns">' + zhang_btns + '</div>' +
            '</div>' +
            '<div class="zhang_me-nums">' +
            '<a href="index.html"><b>' + zhang_u.zhang_post_count + '</b>微博</a>' +
            '<span style="flex:1;font-size:12px;color:var(--zhang_sub);"><b style="display:block;font-size:17px;color:var(--zhang_ink);">' +
            zhang_u.zhang_following_count + '</b>关注</span>' +
            '<span style="flex:1;font-size:12px;color:var(--zhang_sub);"><b style="display:block;font-size:17px;color:var(--zhang_ink);">' +
            zhang_u.zhang_follower_count + '</b>粉丝</span>' +
            '</div>';

        // 关注按钮事件
        const zhang_followBtn = document.getElementById('zhang_followBtn');
        if (zhang_followBtn) {
            zhang_followBtn.addEventListener('click', async function () {
                try {
                    const zhang_result = await zhangApi('POST', '/api/users/' + zhang_viewId + '/follow',
                        { zhang_me: ZHANG_CURRENT_USER_ID });
                    zhang_followBtn.classList.toggle('zhang_btn--ghost', zhang_result.zhang_followed === 1);
                    zhang_followBtn.innerHTML = '<i class="iconfont icon-guanzhu"></i>' +
                        (zhang_result.zhang_followed === 1 ? '取消关注' : '关注 TA');
                    zhangLoadUser();
                } catch (zhang_err) {
                    alert('操作失败：' + zhang_err.message);
                }
            });
        }
    } catch (zhang_err) {
        document.getElementById('zhang_userCard').innerHTML =
            '<div class="zhang_tip zhang_tip--error">用户加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/* ---------- TA 的微博 ---------- */
async function zhangLoadFeed() {
    const zhang_feedTip = document.getElementById('zhang_feedTip');
    zhang_feedTip.className = 'zhang_tip zhang_tip--loading';
    zhang_feedTip.textContent = '微博加载中…';
    try {
        const zhang_list = await zhangApi('GET',
            '/api/posts?me=' + ZHANG_CURRENT_USER_ID + '&userId=' + zhang_viewId);
        zhang_feedTip.className = 'zhang_tip zhang_tip--ok';
        zhang_feedTip.textContent = '接口连接正常，共 ' + zhang_list.length + ' 条微博（表 zhang_posts）';
        zhangRenderPosts(document.getElementById('zhang_feed'), zhang_list);
    } catch (zhang_err) {
        zhang_feedTip.className = 'zhang_tip zhang_tip--error';
        zhang_feedTip.textContent = '微博加载失败：' + zhang_err.message;
        document.getElementById('zhang_feed').innerHTML = '';
    }
}

/* ---------- 关注 / 粉丝列表 ---------- */
let zhang_followType = 'following';

async function zhangLoadFollowList() {
    const zhang_box = document.getElementById('zhang_followCard');
    const zhang_sideBox = document.getElementById('zhang_sideFollowList');
    try {
        const zhang_rows = await zhangApi('GET',
            '/api/users/' + zhang_viewId + '/follows?type=' + zhang_followType);
        const zhang_itemHtml = function (zhang_u) {
            return '<div class="zhang_rec-item">' +
                '<a href="profile.html?id=' + zhang_u.zhang_id + '">' + zhangAvatarHtml(zhang_u, 'zhang_avatar--34') + '</a>' +
                '<div class="zhang_rec-main">' +
                '<div class="zhang_rec-name">' + zhangEscape(zhang_u.zhang_nickname) + '</div>' +
                '<div class="zhang_rec-bio">' + zhangEscape(zhang_u.zhang_bio) + '</div></div>' +
                '</div>';
        };
        const zhang_listHtml = zhang_rows.length
            ? zhang_rows.map(zhang_itemHtml).join('')
            : '<div class="zhang_empty">暂无' + (zhang_followType === 'following' ? '关注' : '粉丝') + '</div>';

        // 左栏显示关注列表，右栏按 Tab 显示
        if (zhang_followType === 'following') {
            zhang_box.innerHTML = '<div class="zhang_card-title"><i class="iconfont icon-guanzhu"></i>关注列表</div>' + zhang_listHtml;
            zhang_sideBox.innerHTML = zhang_listHtml;
        } else {
            zhang_box.innerHTML = '<div class="zhang_card-title"><i class="iconfont icon-guanzhu"></i>关注列表</div>' +
                '<div class="zhang_empty">切换右栏 Tab 查看</div>';
            zhang_sideBox.innerHTML = zhang_listHtml;
        }
    } catch (zhang_err) {
        zhang_sideBox.innerHTML = '<div class="zhang_tip zhang_tip--error">加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function () {
    zhangLoadUser();
    zhangLoadFeed();
    zhangLoadFollowList();
    zhangLoadNavBadge();

    zhangBindFeedEvents(document.getElementById('zhang_feed'), function () {
        zhangLoadUser();
    });

    // 右栏 关注/粉丝 Tab
    document.querySelectorAll('.zhang_tab').forEach(function (zhang_tab) {
        zhang_tab.addEventListener('click', function () {
            if (zhang_tab.dataset.type === zhang_followType) { return; }
            zhang_followType = zhang_tab.dataset.type;
            document.querySelectorAll('.zhang_tab').forEach(function (zhang_t) {
                zhang_t.classList.toggle('zhang_tab--on', zhang_t === zhang_tab);
            });
            zhangLoadFollowList();
        });
    });
});
