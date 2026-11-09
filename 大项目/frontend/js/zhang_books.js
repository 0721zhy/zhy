// 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
// 图书列表页逻辑：加载分类与图书、搜索筛选、新增/编辑/删除（fetch 调用 /api/books）

(function () {
    'use strict';

    const zhang_tip = document.querySelector('#zhang_tip');
    const zhang_tbody = document.querySelector('#zhang_tbody');
    const zhang_search = document.querySelector('#zhang_search');
    const zhang_cateFilter = document.querySelector('#zhang_cateFilter');
    const zhang_addBtn = document.querySelector('#zhang_addBtn');
    const zhang_mask = document.querySelector('#zhang_mask');
    const zhang_form = document.querySelector('#zhang_form');
    const zhang_formTitle = document.querySelector('#zhang_formTitle');

    let zhang_categories = [];

    /* 状态提示 */
    function zhangShowTip(zhang_text, zhang_type) {
        zhang_tip.textContent = zhang_text;
        zhang_tip.className = 'zhang_tip zhang_tip--' + zhang_type;
    }
    function zhangHideTip() {
        zhang_tip.className = 'zhang_tip';
    }

    /* ---------- 分类加载（下拉筛选与表单共用） ---------- */
    async function zhangLoadCategories() {
        try {
            zhang_categories = await zhangApi('GET', '/api/categories');
            zhang_cateFilter.innerHTML = '<option value="">全部分类</option>' +
                zhang_categories.map(function (zhang_c) {
                    return '<option value="' + zhang_c.zhang_id + '">' + zhangEscape(zhang_c.zhang_name) + '</option>';
                }).join('');
            document.querySelector('#zhang_fCate').innerHTML =
                '<option value="">请选择分类…</option>' +
                zhang_categories.map(function (zhang_c) {
                    return '<option value="' + zhang_c.zhang_id + '">' + zhangEscape(zhang_c.zhang_name) + '</option>';
                }).join('');
        } catch (zhang_err) {
            zhangShowTip('分类加载失败：' + zhang_err.message, 'error');
        }
    }

    /* ---------- 图书列表渲染 ---------- */
    async function zhangLoadBooks() {
        zhangShowTip('正在加载图书数据…', 'loading');
        try {
            const zhang_params = new URLSearchParams();
            if (zhang_search.value.trim()) { zhang_params.set('keyword', zhang_search.value.trim()); }
            if (zhang_cateFilter.value) { zhang_params.set('categoryId', zhang_cateFilter.value); }

            const zhang_books = await zhangApi('GET', '/api/books' + (zhang_params.toString() ? '?' + zhang_params : ''));

            if (zhang_books.length === 0) {
                zhang_tbody.innerHTML = '<tr><td colspan="8">没有符合条件的图书</td></tr>';
            } else {
                zhang_tbody.innerHTML = zhang_books.map(function (zhang_b) {
                    const zhang_low = zhang_b.zhang_stock < 20;
                    return '<tr>' +
                        '<td>' + zhang_b.zhang_id + '</td>' +
                        '<td><a class="zhang_book-link" href="book-detail.html?id=' + zhang_b.zhang_id + '">' + zhangEscape(zhang_b.zhang_title) + '</a></td>' +
                        '<td>' + zhangEscape(zhang_b.zhang_author) + '</td>' +
                        '<td><span class="zhang_tag">' + zhangEscape(zhang_b.zhang_category_name) + '</span></td>' +
                        '<td class="zhang_price">¥' + Number(zhang_b.zhang_price).toFixed(2) + '</td>' +
                        '<td><span class="zhang_tag' + (zhang_low ? ' zhang_stock--low' : '') + '">' + zhang_b.zhang_stock + ' 本</span></td>' +
                        '<td>' + zhangEscape(zhang_b.zhang_press) + '</td>' +
                        '<td>' +
                            '<button class="zhang_btn zhang_btn--ghost zhang_btn--sm" data-zhang-edit="' + zhang_b.zhang_id + '"><i class="iconfont icon-bianji"></i>编辑</button> ' +
                            '<button class="zhang_btn zhang_btn--danger zhang_btn--sm" data-zhang-del="' + zhang_b.zhang_id + '"><i class="iconfont icon-shanchu"></i>删除</button>' +
                        '</td>' +
                    '</tr>';
                }).join('');
            }
            zhangHideTip();
        } catch (zhang_err) {
            zhangShowTip('图书加载失败：' + zhang_err.message, 'error');
        }
    }

    /* ---------- 弹层打开/关闭 ---------- */
    function zhangOpenForm(zhang_book) {
        zhang_form.reset();
        if (zhang_book) {
            zhang_formTitle.textContent = '编辑图书（ID：' + zhang_book.zhang_id + '）';
            document.querySelector('#zhang_fId').value = zhang_book.zhang_id;
            document.querySelector('#zhang_fTitle').value = zhang_book.zhang_title;
            document.querySelector('#zhang_fAuthor').value = zhang_book.zhang_author;
            document.querySelector('#zhang_fCate').value = zhang_book.zhang_category_id;
            document.querySelector('#zhang_fPrice').value = zhang_book.zhang_price;
            document.querySelector('#zhang_fStock').value = zhang_book.zhang_stock;
            document.querySelector('#zhang_fPress').value = zhang_book.zhang_press;
            document.querySelector('#zhang_fDate').value = zhang_book.zhang_pub_date || '';
        } else {
            zhang_formTitle.textContent = '新增图书';
            document.querySelector('#zhang_fId').value = '';
        }
        zhang_mask.classList.add('zhang_mask--on');
    }
    function zhangCloseForm() {
        zhang_mask.classList.remove('zhang_mask--on');
    }

    /* ---------- 事件：新增 / 编辑提交 ---------- */
    zhang_addBtn.addEventListener('click', function () { zhangOpenForm(null); });
    document.querySelector('#zhang_cancelBtn').addEventListener('click', zhangCloseForm);
    zhang_mask.addEventListener('click', function (zhang_e) {
        if (zhang_e.target === zhang_mask) { zhangCloseForm(); }
    });

    zhang_form.addEventListener('submit', async function (zhang_e) {
        zhang_e.preventDefault();
        const zhang_id = document.querySelector('#zhang_fId').value;
        const zhang_payload = {
            zhang_title: document.querySelector('#zhang_fTitle').value.trim(),
            zhang_author: document.querySelector('#zhang_fAuthor').value.trim(),
            zhang_category_id: Number(document.querySelector('#zhang_fCate').value),
            zhang_price: Number(document.querySelector('#zhang_fPrice').value) || 0,
            zhang_stock: Number(document.querySelector('#zhang_fStock').value) || 0,
            zhang_press: document.querySelector('#zhang_fPress').value.trim(),
            zhang_pub_date: document.querySelector('#zhang_fDate').value || null
        };
        if (!zhang_payload.zhang_title || !zhang_payload.zhang_author || !zhang_payload.zhang_category_id) {
            zhangShowTip('书名、作者、分类为必填项', 'error');
            return;
        }

        const zhang_saveBtn = document.querySelector('#zhang_saveBtn');
        zhang_saveBtn.disabled = true;
        try {
            if (zhang_id) {
                await zhangApi('PUT', '/api/books/' + zhang_id, zhang_payload);
                zhangShowTip('图书更新成功', 'ok');
            } else {
                await zhangApi('POST', '/api/books', zhang_payload);
                zhangShowTip('图书新增成功', 'ok');
            }
            zhangCloseForm();
            zhangLoadBooks();
        } catch (zhang_err) {
            zhangShowTip('保存失败：' + zhang_err.message, 'error');
        } finally {
            zhang_saveBtn.disabled = false;
        }
    });

    /* ---------- 事件：删除（事件委托） ---------- */
    zhang_tbody.addEventListener('click', async function (zhang_e) {
        const zhang_delBtn = zhang_e.target.closest('[data-zhang-del]');
        if (zhang_delBtn) {
            if (!confirm('确定删除这本图书吗？（ID：' + zhang_delBtn.dataset.zhangDel + '）')) { return; }
            try {
                await zhangApi('DELETE', '/api/books/' + zhang_delBtn.dataset.zhangDel);
                zhangShowTip('删除成功', 'ok');
                zhangLoadBooks();
            } catch (zhang_err) {
                zhangShowTip('删除失败：' + zhang_err.message, 'error');
            }
            return;
        }

        const zhang_editBtn = zhang_e.target.closest('[data-zhang-edit]');
        if (zhang_editBtn) {
            try {
                const zhang_book = await zhangApi('GET', '/api/books/' + zhang_editBtn.dataset.zhangEdit);
                zhangOpenForm(zhang_book);
            } catch (zhang_err) {
                zhangShowTip('获取详情失败：' + zhang_err.message, 'error');
            }
        }
    });

    /* ---------- 事件：搜索与筛选（防抖 300ms） ---------- */
    let zhang_timer = null;
    function zhangDebounceLoad() {
        clearTimeout(zhang_timer);
        zhang_timer = setTimeout(zhangLoadBooks, 300);
    }
    zhang_search.addEventListener('input', zhangDebounceLoad);
    zhang_cateFilter.addEventListener('change', zhangLoadBooks);

    /* ---------- 初始化 ---------- */
    zhangLoadCategories();
    zhangLoadBooks();
})();
