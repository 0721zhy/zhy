# 数据库操作记录（按执行顺序追加，仅凭本文件可在新机器上完整重建数据库）

数据库名：zhang_book_db | 字符集：utf8mb4

## 第 1 步（2026-11-09）：建库、建用户并授权

```sql
CREATE DATABASE IF NOT EXISTS zhang_book_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'mysol80'@'localhost' IDENTIFIED BY '<见 backend/.env 的 DB_PASSWORD>';
CREATE USER IF NOT EXISTS 'mysol80'@'%' IDENTIFIED BY '<见 backend/.env 的 DB_PASSWORD>';
GRANT ALL PRIVILEGES ON zhang_book_db.* TO 'mysol80'@'localhost';
GRANT ALL PRIVILEGES ON zhang_book_db.* TO 'mysol80'@'%';
FLUSH PRIVILEGES;
```

## 第 2 步（2026-11-09）：建表

```sql
USE zhang_book_db;

-- 图书分类表
CREATE TABLE IF NOT EXISTS zhang_categories (
    zhang_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    zhang_name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    zhang_desc VARCHAR(200) NOT NULL DEFAULT '' COMMENT '分类描述',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类表';

-- 图书表
CREATE TABLE IF NOT EXISTS zhang_books (
    zhang_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '图书ID',
    zhang_title VARCHAR(120) NOT NULL COMMENT '书名',
    zhang_author VARCHAR(60) NOT NULL COMMENT '作者',
    zhang_category_id INT NOT NULL COMMENT '所属分类ID',
    zhang_price DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '定价（元）',
    zhang_stock INT NOT NULL DEFAULT 0 COMMENT '库存数量',
    zhang_press VARCHAR(100) NOT NULL DEFAULT '' COMMENT '出版社',
    zhang_pub_date DATE NULL COMMENT '出版日期',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间',
    CONSTRAINT zhang_fk_book_category FOREIGN KEY (zhang_category_id) REFERENCES zhang_categories(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书表';
```

## 第 3 步（2026-11-09）：插入测试数据（分类 8 条）

```sql
INSERT INTO zhang_categories (zhang_name, zhang_desc) VALUES
('计算机技术', '编程语言、数据库、网络与软件开发类图书'),
('文学小说', '中外经典文学、当代小说与散文作品'),
('经济管理', '经济学理论、企业管理与市场营销类图书'),
('历史人文', '中外历史、哲学与人文社科类图书'),
('少儿教育', '儿童文学、科普读物与教辅材料'),
('艺术设计', '平面设计、绘画技法与艺术鉴赏类图书'),
('心理励志', '心理学入门、自我成长与励志类图书'),
('外语学习', '英语、日语等语言学习与考试用书');
```

## 第 4 步（2026-11-09）：插入测试数据（图书 10 条）

```sql
INSERT INTO zhang_books (zhang_title, zhang_author, zhang_category_id, zhang_price, zhang_stock, zhang_press, zhang_pub_date) VALUES
('JavaScript 高级程序设计', '马特·弗里斯比', 1, 129.00, 35, '人民邮电出版社', '2022-05-01'),
('MySQL 必知必会', '本·福塔', 1, 49.80, 52, '人民邮电出版社', '2020-08-01'),
('活着', '余华', 2, 45.00, 88, '作家出版社', '2012-08-01'),
('三体（全集）', '刘慈欣', 2, 93.00, 66, '重庆出版社', '2008-01-01'),
('经济学原理', '曼昆', 3, 98.00, 27, '北京大学出版社', '2015-05-01'),
('明朝那些事儿（增补版）', '当年明月', 4, 358.00, 19, '北京联合出版公司', '2017-03-01'),
('夏洛的网', 'E.B.怀特', 5, 32.00, 74, '上海译文出版社', '2014-05-01'),
('写给大家看的设计书', '罗宾·威廉姆斯', 6, 69.00, 41, '人民邮电出版社', '2016-01-01'),
('被讨厌的勇气', '岸见一郎', 7, 55.00, 93, '机械工业出版社', '2015-12-01'),
('英语语法新思维', '张满胜', 8, 59.80, 46, '群言出版社', '2019-04-01');
```

说明：本文件同步保留了 backend/zhang_init.sql 初始化脚本，两者内容一致；后续每次建表 / 改表 / 插入数据都会在本文件按顺序追加 SQL。

## 第 5 步（2026-11-09）：创建 mysql80 测试用户并授权（database.html 默认凭据）

```sql
CREATE USER IF NOT EXISTS 'mysql80'@'localhost' IDENTIFIED BY '<见 backend/.env 的 DB_PASSWORD>';
CREATE USER IF NOT EXISTS 'mysql80'@'%' IDENTIFIED BY '<见 backend/.env 的 DB_PASSWORD>';
GRANT ALL PRIVILEGES ON zhang_book_db.* TO 'mysql80'@'localhost';
GRANT ALL PRIVILEGES ON zhang_book_db.* TO 'mysql80'@'%';
FLUSH PRIVILEGES;
```

## 第 6 步（2026-11-09）：科技新闻表 zhang_news

建表与 8 条测试数据的完整 SQL 见 `backend/zhang_news.sql`（可重复执行，先 USE zhang_book_db）。字段：zhang_id、zhang_title、zhang_summary、zhang_content、zhang_source、zhang_category、zhang_publish_time、zhang_views、zhang_created_at。

## 第 7 步（2026-11-09）：校园图文表 zhang_gallery

建表与 6 条数据 SQL 见 `backend/zhang_gallery.sql`。字段：zhang_id、zhang_title、zhang_desc、zhang_image（相对 frontend/ 的图片路径）、zhang_place、zhang_tag、zhang_publish_time、zhang_sort、zhang_created_at。图片为本地生成文件 `frontend/img/gallery-1.jpg` ~ `gallery-6.jpg`。

------------------------------------------------------------
## 2026-11-09 大项目改版：微博数据库 zhang_weibo_db（GLM-5.3-FlashX）

旧库 zhang_book_db（zhang_categories / zhang_books / zhang_news / zhang_gallery）不再使用；
新库脚本已完整保存在 backend/zhang_weibo.sql，仅凭该文件即可在新机器重建。要点如下（完整 SQL 含全部 INSERT 见 zhang_weibo.sql）：

CREATE DATABASE IF NOT EXISTS zhang_weibo_db DEFAULT CHARACTER SET utf8mb4;
USE zhang_weibo_db;

CREATE TABLE zhang_users (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_username VARCHAR(50) NOT NULL UNIQUE,
    zhang_nickname VARCHAR(50) NOT NULL,
    zhang_avatar CHAR(7) NOT NULL DEFAULT '#eb7350',
    zhang_bio VARCHAR(200) NOT NULL DEFAULT '',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_posts (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_user_id INT NOT NULL,
    zhang_content VARCHAR(500) NOT NULL,
    zhang_image VARCHAR(200) NOT NULL DEFAULT '',
    zhang_reposts INT NOT NULL DEFAULT 0,
    zhang_comments INT NOT NULL DEFAULT 0,
    zhang_likes INT NOT NULL DEFAULT 0,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_post_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_comments (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_post_id INT NOT NULL,
    zhang_user_id INT NOT NULL,
    zhang_content VARCHAR(300) NOT NULL,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_comment_post FOREIGN KEY (zhang_post_id) REFERENCES zhang_posts(zhang_id),
    CONSTRAINT zhang_fk_comment_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_likes (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_post_id INT NOT NULL,
    zhang_user_id INT NOT NULL,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY zhang_uniq_like (zhang_post_id, zhang_user_id),
    CONSTRAINT zhang_fk_like_post FOREIGN KEY (zhang_post_id) REFERENCES zhang_posts(zhang_id),
    CONSTRAINT zhang_fk_like_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_follows (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_follower_id INT NOT NULL,
    zhang_followee_id INT NOT NULL,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY zhang_uniq_follow (zhang_follower_id, zhang_followee_id),
    CONSTRAINT zhang_fk_follow_a FOREIGN KEY (zhang_follower_id) REFERENCES zhang_users(zhang_id),
    CONSTRAINT zhang_fk_follow_b FOREIGN KEY (zhang_followee_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_messages (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_user_id INT NOT NULL,
    zhang_type VARCHAR(20) NOT NULL COMMENT 'like/comment/follow/system',
    zhang_content VARCHAR(300) NOT NULL,
    zhang_is_read TINYINT NOT NULL DEFAULT 0,
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT zhang_fk_msg_user FOREIGN KEY (zhang_user_id) REFERENCES zhang_users(zhang_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE zhang_hot_search (
    zhang_id INT AUTO_INCREMENT PRIMARY KEY,
    zhang_keyword VARCHAR(100) NOT NULL,
    zhang_heat INT NOT NULL DEFAULT 0,
    zhang_tag VARCHAR(20) NOT NULL DEFAULT '' COMMENT '热/新/爆/沸',
    zhang_rank INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

测试数据规模：zhang_users 8 条、zhang_posts 9 条、zhang_comments 13 条、zhang_likes 18 条、zhang_follows 14 条、zhang_messages 9 条、zhang_hot_search 8 条（完整 INSERT 见 backend/zhang_weibo.sql）。
