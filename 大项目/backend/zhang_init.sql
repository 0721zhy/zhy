-- ============================================
-- 张海玉 24001010521 | 2026-11-09 | 图书管理数据库建表脚本
-- 执行顺序：1 建库建用户 → 2 本文件建表 → 3 插入测试数据
-- ============================================

USE zhang_book_db;

-- 1. 图书分类表
CREATE TABLE IF NOT EXISTS zhang_categories (
    zhang_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    zhang_name VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    zhang_desc VARCHAR(200) NOT NULL DEFAULT '' COMMENT '分类描述',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='图书分类表';

-- 2. 图书表
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

-- 3. 分类测试数据（8 条）
INSERT INTO zhang_categories (zhang_name, zhang_desc) VALUES
('计算机技术', '编程语言、数据库、网络与软件开发类图书'),
('文学小说', '中外经典文学、当代小说与散文作品'),
('经济管理', '经济学理论、企业管理与市场营销类图书'),
('历史人文', '中外历史、哲学与人文社科类图书'),
('少儿教育', '儿童文学、科普读物与教辅材料'),
('艺术设计', '平面设计、绘画技法与艺术鉴赏类图书'),
('心理励志', '心理学入门、自我成长与励志类图书'),
('外语学习', '英语、日语等语言学习与考试用书');

-- 4. 图书测试数据（10 条）
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

-- 5. 验证
SELECT COUNT(*) AS categories FROM zhang_categories;
SELECT COUNT(*) AS books FROM zhang_books;
