-- 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：GLM-5.3-FlashX
-- 微博网页项目数据库初始化脚本（可重复执行，仅凭本文件即可完整重建数据库）

CREATE DATABASE IF NOT EXISTS zhang_weibo_db DEFAULT CHARACTER SET utf8mb4;
USE zhang_weibo_db;

/* ---------- 用户表 ---------- */
DROP TABLE IF EXISTS zhang_users;
CREATE TABLE zhang_users (
    zhang_id       INT AUTO_INCREMENT PRIMARY KEY,
    zhang_username VARCHAR(50)  NOT NULL UNIQUE COMMENT '登录名',
    zhang_nickname VARCHAR(50)  NOT NULL COMMENT '昵称',
    zhang_avatar   CHAR(7)      NOT NULL DEFAULT '#eb7350' COMMENT '头像底色（前端色块+首字渲染）',
    zhang_bio      VARCHAR(200) NOT NULL DEFAULT '' COMMENT '个人简介',
    zhang_created_at DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 微博表 ---------- */
DROP TABLE IF EXISTS zhang_posts;
CREATE TABLE zhang_posts (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_user_id   INT          NOT NULL COMMENT '作者',
    zhang_content   VARCHAR(500) NOT NULL COMMENT '微博正文',
    zhang_image     VARCHAR(200) NOT NULL DEFAULT '' COMMENT '配图路径（可空）',
    zhang_reposts   INT          NOT NULL DEFAULT 0 COMMENT '转发数',
    zhang_comments  INT          NOT NULL DEFAULT 0 COMMENT '评论数（冗余计数）',
    zhang_likes     INT          NOT NULL DEFAULT 0 COMMENT '点赞数（冗余计数）',
    zhang_created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_post_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 评论表 ---------- */
DROP TABLE IF EXISTS zhang_comments;
CREATE TABLE zhang_comments (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_post_id   INT          NOT NULL COMMENT '所属微博',
    zhang_user_id   INT          NOT NULL COMMENT '评论人',
    zhang_content   VARCHAR(300) NOT NULL COMMENT '评论内容',
    zhang_created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_comment_post FOREIGN KEY (zhang_post_id) REFERENCES zhang_posts(zhang_id),
    CONSTRAINT zhang_fk_comment_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 点赞表（同一用户同一微博仅一条） ---------- */
DROP TABLE IF EXISTS zhang_likes;
CREATE TABLE zhang_likes (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_post_id   INT NOT NULL,
    zhang_user_id   INT NOT NULL,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY zhang_uniq_like (zhang_post_id, zhang_user_id),
    CONSTRAINT zhang_fk_like_post FOREIGN KEY (zhang_post_id) REFERENCES zhang_posts(zhang_id),
    CONSTRAINT zhang_fk_like_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 关注表 ---------- */
DROP TABLE IF EXISTS zhang_follows;
CREATE TABLE zhang_follows (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_follower_id INT NOT NULL COMMENT '关注者',
    zhang_followee_id INT NOT NULL COMMENT '被关注者',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY zhang_uniq_follow (zhang_follower_id, zhang_followee_id),
    CONSTRAINT zhang_fk_follow_a FOREIGN KEY (zhang_follower_id) REFERENCES zhang_users(zhang_id),
    CONSTRAINT zhang_fk_follow_b FOREIGN KEY (zhang_followee_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 消息通知表 ---------- */
DROP TABLE IF EXISTS zhang_messages;
CREATE TABLE zhang_messages (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_user_id   INT          NOT NULL COMMENT '接收人',
    zhang_type      VARCHAR(20)  NOT NULL COMMENT '类型：like/comment/follow/system',
    zhang_content   VARCHAR(300) NOT NULL COMMENT '消息内容',
    zhang_is_read   TINYINT      NOT NULL DEFAULT 0 COMMENT '0 未读 1 已读',
    zhang_created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_msg_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ---------- 热搜榜表 ---------- */
DROP TABLE IF EXISTS zhang_hot_search;
CREATE TABLE zhang_hot_search (
    zhang_id        INT AUTO_INCREMENT PRIMARY KEY,
    zhang_keyword   VARCHAR(100) NOT NULL COMMENT '热搜词',
    zhang_heat      INT          NOT NULL DEFAULT 0 COMMENT '热度值',
    zhang_tag       VARCHAR(20)  NOT NULL DEFAULT '' COMMENT '标签：热/新/爆/沸',
    zhang_rank      INT          NOT NULL DEFAULT 0 COMMENT '排名'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/* ==================== 测试数据 ==================== */

INSERT INTO zhang_users (zhang_username, zhang_nickname, zhang_avatar, zhang_bio) VALUES
('zhanghaiyu', '张海玉', '#eb7350', '大连东软信息学院 · 高级网页设计课程 · 全栈练习生'),
('linkeji',    '林科技', '#4a90d9', '关注前沿科技，每日分享 AI 资讯'),
('wangsheying','王摄影', '#5cb85c', '街头摄影爱好者，用镜头记录城市'),
('limeshi',    '李美食', '#f0ad4e', '探店博主，大连海鲜第一线'),
('zhaolvyou',  '赵旅行', '#9b59b6', '去过 32 个城市的旅行者'),
('chenmao',    '陈喵喵', '#e67e22', '铲屎官，两只橘猫的妈妈'),
('liuren',     '刘路人', '#1abc9c', '吃瓜群众，观点随机'),
('sunxuexi',   '孙学习', '#34495e', '大三学生，正在备战考研');

INSERT INTO zhang_posts (zhang_user_id, zhang_content, zhang_image, zhang_reposts, zhang_comments, zhang_likes, zhang_created_at) VALUES
(2, '刚刚体验了最新的国产大模型，代码能力提升非常明显，前端切图这种活真的可以被接管一大半了。各位程序员的护城河在哪里？我认为是需求理解和系统设计。', 'img/gallery-3.jpg', 45, 12, 230, '2026-11-09 09:15:00'),
(3, '今天清晨的星海广场，海雾还没散，拍到了一组自己非常满意的照片。城市在苏醒前的十分钟最温柔。', 'img/gallery-1.jpg', 18, 7, 156, '2026-11-09 08:02:00'),
(4, '第五家了！大连的老铁们，铁板鱿鱼 yyds，这家店的辣炒蚬子也是一绝，地址在评论区。', 'img/gallery-4.jpg', 9, 15, 98, '2026-11-08 21:30:00'),
(5, 'Day 12，青藏线骑行日记。今天翻越了海拔 4700 的垭口，风吹经幡的声音一辈子忘不掉。', 'img/gallery-2.jpg', 66, 20, 412, '2026-11-08 18:45:00'),
(6, '家里的橘猫今天把我的键盘踩出了一串乱码，发出来给大家品品：zhang_zhang_zhang_喵。看来它也想学编程。', 'img/gallery-6.jpg', 33, 18, 289, '2026-11-08 14:20:00'),
(1, '大项目终于开工了！决定做一个微博网页：Express + MySQL + 原生前端，信息流、评论、点赞、关注、热搜、消息通知全套功能都要有。冲！', 'img/gallery-5.jpg', 12, 6, 87, '2026-11-08 10:00:00'),
(8, '考研倒计时 40 天。今天英语阅读全对，数学错了一道大题，明天开始主攻线性代数。记录一下，希望 12 月的自己不后悔。', '', 5, 9, 76, '2026-11-07 23:10:00'),
(7, '路边吃瓜：楼下奶茶店排队两小时的那家，今天试了，就……还行吧。排队的主力军居然是大爷大妈，谜。', '', 3, 11, 45, '2026-11-07 16:40:00'),
(2, 'AI 绘画又更新了，手部结构这次终于稳定。美术行业的变革真的开始了，建议从业者尽早把 AI 变成工具而不是对手。', '', 51, 24, 375, '2026-11-06 11:25:00');

INSERT INTO zhang_comments (zhang_post_id, zhang_user_id, zhang_content, zhang_created_at) VALUES
(1, 1, '同感，重复劳动确实会被替代，但架构能力短期取代不了。', '2026-11-09 09:40:00'),
(1, 8, '作为学生更焦虑了，卷不动了属于是。', '2026-11-09 10:05:00'),
(1, 7, '护城河是发际线。', '2026-11-09 10:22:00'),
(2, 5, '这个机位绝了，求坐标！', '2026-11-09 08:30:00'),
(2, 6, '拍出了电影感。', '2026-11-09 09:01:00'),
(3, 1, '已收藏，周末就去。', '2026-11-08 21:50:00'),
(3, 7, '辣炒蚬子确实好吃，下周去验货。', '2026-11-08 22:10:00'),
(4, 3, '注意安全，垭口风大！', '2026-11-08 19:00:00'),
(4, 8, '好励志，祝顺利！', '2026-11-08 20:15:00'),
(5, 1, '哈哈它可能是在教你命名规范：zhang_ 前缀。', '2026-11-08 14:40:00'),
(6, 2, '加油，大项目做完记得开源。', '2026-11-08 10:30:00'),
(6, 4, '微博主题选得好，比图书管理系统有意思多了。', '2026-11-08 11:05:00'),
(7, 6, '抱抱，最后 40 天咬住！', '2026-11-07 23:30:00');

INSERT INTO zhang_likes (zhang_post_id, zhang_user_id, zhang_created_at) VALUES
(1, 1, '2026-11-09 09:20:00'), (1, 5, '2026-11-09 09:25:00'), (1, 8, '2026-11-09 10:00:00'),
(2, 1, '2026-11-09 08:10:00'), (2, 6, '2026-11-09 08:40:00'),
(3, 1, '2026-11-08 21:45:00'), (3, 5, '2026-11-08 22:00:00'), (3, 8, '2026-11-08 22:30:00'),
(4, 3, '2026-11-08 18:50:00'), (4, 1, '2026-11-08 19:10:00'), (4, 6, '2026-11-08 20:00:00'),
(5, 1, '2026-11-08 14:25:00'), (5, 7, '2026-11-08 15:00:00'),
(6, 2, '2026-11-08 10:10:00'), (6, 4, '2026-11-08 10:20:00'), (6, 8, '2026-11-08 11:00:00'),
(8, 2, '2026-11-06 12:00:00'), (8, 7, '2026-11-06 12:30:00');

INSERT INTO zhang_follows (zhang_follower_id, zhang_followee_id, zhang_created_at) VALUES
(1, 2, '2026-11-01 09:00:00'), (1, 3, '2026-11-01 09:05:00'), (1, 5, '2026-11-02 10:00:00'),
(1, 4, '2026-11-03 11:00:00'),
(2, 1, '2026-11-02 09:00:00'), (3, 1, '2026-11-02 12:00:00'), (5, 1, '2026-11-04 08:00:00'),
(6, 1, '2026-11-05 09:00:00'), (8, 1, '2026-11-06 20:00:00'),
(2, 3, '2026-11-03 10:00:00'), (3, 2, '2026-11-03 10:30:00'), (8, 2, '2026-11-04 14:00:00'),
(6, 4, '2026-11-05 16:00:00'), (7, 5, '2026-11-06 18:00:00');

INSERT INTO zhang_messages (zhang_user_id, zhang_type, zhang_content, zhang_is_read, zhang_created_at) VALUES
(1, 'follow',  '林科技 关注了你',                  0, '2026-11-09 09:30:00'),
(1, 'like',    '王摄影 赞了你的微博「大项目终于开工了」', 0, '2026-11-08 11:10:00'),
(1, 'comment', '林科技 评论了你：加油，大项目做完记得开源。', 0, '2026-11-08 10:30:00'),
(1, 'system',  '欢迎使用微博网页版，祝你玩得愉快！',     1, '2026-11-07 09:00:00'),
(1, 'follow',  '孙学习 关注了你',                  1, '2026-11-06 20:05:00'),
(2, 'like',    '张海玉 赞了你的微博',               0, '2026-11-09 09:20:00'),
(2, 'comment', '张海玉 评论了你：同感，重复劳动确实会被替代。', 0, '2026-11-09 09:40:00'),
(3, 'like',    '张海玉 赞了你的微博「星海广场清晨」',   1, '2026-11-09 08:10:00'),
(4, 'comment', '张海玉 评论了你：已收藏，周末就去。',   1, '2026-11-08 21:50:00');

INSERT INTO zhang_hot_search (zhang_keyword, zhang_heat, zhang_tag, zhang_rank) VALUES
('国产大模型代码能力突破', 2385691, '爆', 1),
('AI 绘画手部结构修复',   1953420, '热', 2),
('星海广场清晨海雾',      1622874, '新', 3),
('考研倒计时40天',        1483920, '',   4),
('大连海鲜探店地图',      1267530, '热', 5),
('青藏线骑行日记',        1102483, '',   6),
('橘猫踩键盘输出乱码',     938210, '沸', 7),
('全栈开发学习路线',       802465, '',   8);
