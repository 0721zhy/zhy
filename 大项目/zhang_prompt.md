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

## 2026-11-09 16:10 | DeepSeek-V4.1-Flash

提示词全文：

> 完成图文列表页面的显示，图片可用网络图片或者自己创造。一个新的数据库表

交付：新建 zhang_gallery 表（6 条数据）；用图像生成工具自建 6 张本地图片存于 frontend/img/；后端 GET /api/gallery（tag 筛选）、GET /api/gallery/tags；前端 gallery.html 图文卡片列表（状态条显示接口连接/条数/耗时，标签筛选、点击看大图）。

2026-11-09 | 现在帮我这个项目换成我的大项目微博网页。（方案已确认：保留 Express+MySQL+原生前端架构与 521 端口，把图书/新闻/图文业务整体替换为完整微博功能：微博发布、信息流、评论、点赞、个人主页、关注/粉丝、热搜榜、消息通知） | GLM-5.3-FlashX
2026-11-12 | 完成一个chat.html,内容是调用llm的接口完成聊天功能，发送的提示词和接收到的数据都在控制台输出，Api-key：sk-osyxygtqxntnmrbjmuwudasxpeeyuyliywdvvgadathospkd（SiliconFlow DeepSeek-V4-Flash），在 大项目 路径里面完成 | GLM-5.3-FlashX
