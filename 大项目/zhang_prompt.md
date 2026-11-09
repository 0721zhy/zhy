# AI 开发指令记录（追加写入，禁止覆盖）

## 2026-11-09 | DeepSeek-V4.1-Flash / GLM-5.3-FlashX

提示词全文：

> 根据文件帮助我完成项目（《全栈提示词.docx》）
> D:\three\gaojiwangyesheji\site\大项目在此路径根据文件帮助我完成项目

说明：按《全栈提示词.docx》完成图书管理系统全栈项目搭建——frontend/ 原生三件套（css/js/fonts/images 子目录），backend/ Express + MySQL（RESTful + MVC，/api/ 前缀，端口 521，express.static 托管 frontend，全跨域），建库 zhang_book_db 并建 zhang_categories（8 条数据）、zhang_books（10 条数据）两表，凭据写入 backend/.env，记录文件 zhang_prompt.md / zhang_interface.md / zhang_database.md 同步创建。项目初始化由 DeepSeek-V4.1-Flash 与 GLM-5.3-FlashX 协作完成。

## 2026-11-09 14:30 | DeepSeek-V4.1-Flash

提示词全文：

> 创建database.html页面，输入用户名，密码，链接数据库，数据库使用mysql，成功和错误都有提示，默认用户mysql80，密码zhang0168。


## 2026-11-09 14:45 | DeepSeek-V4.1-Flash

提示词全文：

> 用户名root@localhost

处理：database.html 默认用户名改为 root@localhost，并支持「用户名@主机」写法自动拆分；已实测 root/zhang0168 连接成功（MySQL 8.0.43 / zhang_book_db）。

## 2026-11-09 15:20 | DeepSeek-V4.1-Flash

提示词全文：

> 完成科技新闻跟列表页面，新闻数据存在数据库表里面。网页显示后端接口连接和数据内容

交付：zhang_news 表（8 条数据）、GET /api/news（keyword/category 筛选）、GET /api/news/categories、GET /api/news/:id（浏览量 +1）；前端 news.html 列表页（顶部展示接口地址/连接状态/条数/耗时）+ news-detail.html 详情页。
