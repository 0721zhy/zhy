// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 消息通知页逻辑：加载消息列表、未读高亮、一键全部已读

// 消息类型 → 图标配色与名称
const ZHANG_MSG_META = {
    like:    { zhang_icon: 'icon-xihuan',   zhang_color: 'zhang_msg-icon--like' },
    comment: { zhang_icon: 'icon-xinxi',    zhang_color: 'zhang_msg-icon--comment' },
    follow:  { zhang_icon: 'icon-guanzhu',  zhang_color: 'zhang_msg-icon--follow' },
    system:  { zhang_icon: 'icon-gengduo',  zhang_color: 'zhang_msg-icon--system' }
};

/* ---------- 加载消息列表 ---------- */
async function zhangLoadMessages() {
    const zhang_tip = document.getElementById('zhang_msgTip');
    zhang_tip.className = 'zhang_tip zhang_tip--loading';
    zhang_tip.textContent = '消息加载中…';

    try {
        const zhang_data = await zhangApi('GET', '/api/messages?userId=' + ZHANG_CURRENT_USER_ID);
        zhang_tip.className = 'zhang_tip zhang_tip--ok';
        zhang_tip.textContent = '接口连接正常，共 ' + zhang_data.zhang_list.length +
            ' 条消息，未读 ' + zhang_data.zhang_unread + ' 条（表 zhang_messages）';

        document.getElementById('zhang_unreadInfo').textContent =
            zhang_data.zhang_unread > 0 ? '未读 ' + zhang_data.zhang_unread + ' 条' : '全部已读';

        const zhang_box = document.getElementById('zhang_msgList');
        if (!zhang_data.zhang_list.length) {
            zhang_box.innerHTML = '<div class="zhang_empty">暂无消息</div>';
            return;
        }
        zhang_box.innerHTML = zhang_data.zhang_list.map(function (zhang_m) {
            const zhang_meta = ZHANG_MSG_META[zhang_m.zhang_type] || ZHANG_MSG_META.system;
            return '<div class="zhang_msg-item' + (Number(zhang_m.zhang_is_read) === 0 ? ' zhang_msg-item--unread' : '') + '">' +
                '<span class="zhang_msg-icon ' + zhang_meta.zhang_color + '"><i class="iconfont ' + zhang_meta.zhang_icon + '"></i></span>' +
                '<div class="zhang_msg-main">' +
                '<div class="zhang_msg-text">' + zhangEscape(zhang_m.zhang_content) + '</div>' +
                '<div class="zhang_msg-time">' + zhangFormatTime(zhang_m.zhang_created_at) + '</div>' +
                '</div>' +
                (Number(zhang_m.zhang_is_read) === 0 ? '<span class="zhang_msg-dot" title="未读"></span>' : '') +
                '</div>';
        }).join('');
    } catch (zhang_err) {
        zhang_tip.className = 'zhang_tip zhang_tip--error';
        zhang_tip.textContent = '消息加载失败：' + zhang_err.message;
        document.getElementById('zhang_msgList').innerHTML = '';
    }
}

/* ---------- 初始化 ---------- */
document.addEventListener('DOMContentLoaded', function () {
    zhangLoadMessages();
    zhangLoadNavBadge();

    // 一键全部已读
    document.getElementById('zhang_readBtn').addEventListener('click', async function () {
        try {
            await zhangApi('POST', '/api/messages/read', { zhang_user_id: ZHANG_CURRENT_USER_ID });
            zhangLoadMessages();
            const zhang_badge = document.querySelector('.zhang_nav-badge');
            if (zhang_badge) { zhang_badge.style.display = 'none'; }
        } catch (zhang_err) {
            alert('操作失败：' + zhang_err.message);
        }
    });
});
