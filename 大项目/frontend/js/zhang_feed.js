// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 微博卡片渲染与交互：信息流页 / 个人主页共用（点赞、评论展开、发表评论、删除）

/**
 * 单条微博卡片 HTML
 * @param {object} zhang_post 微博对象（含作者信息与 zhang_liked）
 */
function zhangPostCardHtml(zhang_post) {
    const zhang_isMine = Number(zhang_post.zhang_user_id) === ZHANG_CURRENT_USER_ID;
    let zhang_html =
        '<div class="zhang_post" data-id="' + zhang_post.zhang_id + '">' +
        '<a href="profile.html?id=' + zhang_post.zhang_user_id + '">' +
        zhangAvatarHtml(zhang_post, 'zhang_avatar--40') + '</a>' +
        '<div class="zhang_post-body">' +
        '<div class="zhang_post-head">' +
        '<a class="zhang_post-name" href="profile.html?id=' + zhang_post.zhang_user_id + '">' +
        zhangEscape(zhang_post.zhang_nickname) + '</a>' +
        '<span class="zhang_post-time">' + zhangFormatTime(zhang_post.zhang_created_at) + '</span>';

    // 仅作者本人可见删除按钮
    if (zhang_isMine) {
        zhang_html += '<button class="zhang_post-del" data-act="del" title="删除微博">' +
            '<i class="iconfont icon-shanchu"></i>删除</button>';
    }
    zhang_html += '</div>' +
        '<div class="zhang_post-text">' + zhangEscape(zhang_post.zhang_content) + '</div>';

    if (zhang_post.zhang_image) {
        zhang_html += '<img class="zhang_post-img" src="' + zhangEscape(zhang_post.zhang_image) + '" alt="微博配图">';
    }
    zhang_html +=
        '<div class="zhang_post-acts">' +
        '<button class="zhang_act" data-act="repost"><i class="iconfont icon-faxian1"></i>转发 ' + zhang_post.zhang_reposts + '</button>' +
        '<button class="zhang_act" data-act="comment"><i class="iconfont icon-xinxi"></i>评论 ' + zhang_post.zhang_comments + '</button>' +
        '<button class="zhang_act' + (Number(zhang_post.zhang_liked) === 1 ? ' zhang_act--on' : '') + '" data-act="like">' +
        '<i class="iconfont icon-xihuan"></i><span>' + (Number(zhang_post.zhang_liked) === 1 ? '已赞 ' : '赞 ') + zhang_post.zhang_likes + '</span></button>' +
        '</div>' +
        '<div class="zhang_comments" style="display:none"></div>' +
        '</div></div>';
    return zhang_html;
}

/**
 * 渲染微博列表到容器
 * @param {HTMLElement} zhang_box 容器
 * @param {Array} zhang_list 微博数组
 */
function zhangRenderPosts(zhang_box, zhang_list) {
    if (!zhang_list.length) {
        zhang_box.innerHTML = '<div class="zhang_empty">暂无微博，快来发第一条吧</div>';
        return;
    }
    zhang_box.innerHTML = zhang_list.map(zhangPostCardHtml).join('');
}

/**
 * 展开 / 收起某条微博的评论区（首次展开时加载评论）
 */
async function zhangToggleComments(zhang_postEl) {
    const zhang_box = zhang_postEl.querySelector('.zhang_comments');
    const zhang_postId = zhang_postEl.dataset.id;

    if (zhang_box.style.display !== 'none') {
        zhang_box.style.display = 'none';
        return;
    }
    zhang_box.style.display = 'block';

    if (zhang_box.dataset.loaded === '1') { return; }
    zhang_box.innerHTML = '<div class="zhang_comment-empty">评论加载中…</div>';
    try {
        const zhang_rows = await zhangApi('GET', '/api/posts/' + zhang_postId + '/comments');
        zhang_box.dataset.loaded = '1';
        zhangRenderCommentBox(zhang_box, zhang_postId, zhang_rows);
    } catch (zhang_err) {
        zhang_box.innerHTML = '<div class="zhang_comment-empty">评论加载失败：' + zhangEscape(zhang_err.message) + '</div>';
    }
}

/**
 * 渲染评论列表 + 评论输入框
 */
function zhangRenderCommentBox(zhang_box, zhang_postId, zhang_rows) {
    let zhang_html = zhang_rows.length
        ? zhang_rows.map(function (zhang_c) {
            return '<div class="zhang_comment">' +
                zhangAvatarHtml(zhang_c, 'zhang_avatar--28') +
                '<div class="zhang_comment-main">' +
                '<div class="zhang_comment-name">' + zhangEscape(zhang_c.zhang_nickname) + '</div>' +
                '<div class="zhang_comment-text">' + zhangEscape(zhang_c.zhang_content) + '</div>' +
                '<div class="zhang_comment-time">' + zhangFormatTime(zhang_c.zhang_created_at) + '</div>' +
                '</div></div>';
        }).join('')
        : '<div class="zhang_comment-empty">还没有评论，来抢沙发</div>';

    zhang_html +=
        '<form class="zhang_comment-form" data-post="' + zhang_postId + '">' +
        '<input class="zhang_comment-input" maxlength="300" placeholder="写下你的评论…" autocomplete="off">' +
        '<button type="submit" class="zhang_btn zhang_btn--sm">评论</button>' +
        '</form>';
    zhang_box.innerHTML = zhang_html;
}

/**
 * 微博卡片事件委托（点赞 / 评论展开 / 删除 / 提交评论）
 * @param {HTMLElement} zhang_feedEl 信息流容器（事件绑定在其上，内部卡片可动态增删）
 * @param {Function|null} zhang_onChange 卡片数据变化后的回调（用于刷新页面计数）
 */
function zhangBindFeedEvents(zhang_feedEl, zhang_onChange) {
    zhang_feedEl.addEventListener('click', async function (zhang_ev) {
        const zhang_btn = zhang_ev.target.closest('[data-act]');
        if (!zhang_btn) { return; }
        const zhang_postEl = zhang_btn.closest('.zhang_post');
        const zhang_postId = zhang_postEl.dataset.id;
        const zhang_act = zhang_btn.dataset.act;

        try {
            if (zhang_act === 'like') {
                const zhang_data = await zhangApi('POST', '/api/posts/' + zhang_postId + '/like',
                    { zhang_user_id: ZHANG_CURRENT_USER_ID });
                zhang_btn.classList.toggle('zhang_act--on', zhang_data.zhang_liked === 1);
                zhang_btn.querySelector('span').textContent =
                    (zhang_data.zhang_liked === 1 ? '已赞 ' : '赞 ') + zhang_data.zhang_likes;
                if (zhang_onChange) { zhang_onChange(); }

            } else if (zhang_act === 'comment') {
                zhangToggleComments(zhang_postEl);

            } else if (zhang_act === 'del') {
                if (!confirm('确定删除这条微博吗？')) { return; }
                await zhangApi('DELETE', '/api/posts/' + zhang_postId);
                zhang_postEl.remove();
                if (zhang_onChange) { zhang_onChange(); }
            }
        } catch (zhang_err) {
            alert('操作失败：' + zhang_err.message);
        }
    });

    // 评论提交（表单 submit 事件）
    zhang_feedEl.addEventListener('submit', async function (zhang_ev) {
        const zhang_form = zhang_ev.target.closest('.zhang_comment-form');
        if (!zhang_form) { return; }
        zhang_ev.preventDefault();
        const zhang_input = zhang_form.querySelector('.zhang_comment-input');
        const zhang_content = zhang_input.value.trim();
        if (!zhang_content) { return; }

        try {
            const zhang_rows = await zhangApi('POST', '/api/posts/' + zhang_form.dataset.post + '/comments',
                { zhang_user_id: ZHANG_CURRENT_USER_ID, zhang_content: zhang_content });
            const zhang_box = zhang_form.closest('.zhang_comments');
            zhangRenderCommentBox(zhang_box, zhang_form.dataset.post, zhang_rows);
            zhang_box.dataset.loaded = '1';
            // 更新卡片上的评论计数
            const zhang_postEl = zhang_form.closest('.zhang_post');
            const zhang_cBtn = zhang_postEl.querySelector('[data-act="comment"]');
            zhang_cBtn.innerHTML = '<i class="iconfont icon-xinxi"></i>评论 ' + zhang_rows.length;
            if (zhang_onChange) { zhang_onChange(); }
        } catch (zhang_err) {
            alert('评论失败：' + zhang_err.message);
        }
    });
}
