-- 姓名：张海玉 | 学号：24001010521 | 时间：2026-11-09 | 大模型：DeepSeek-V4.1-Flash
-- 校园图文表：建表 + 6 条数据（图片为本地生成文件，路径相对于 frontend/）

USE zhang_book_db;

CREATE TABLE IF NOT EXISTS zhang_gallery (
    zhang_id INT PRIMARY KEY AUTO_INCREMENT COMMENT '图文ID',
    zhang_title VARCHAR(120) NOT NULL COMMENT '标题',
    zhang_desc VARCHAR(300) NOT NULL DEFAULT '' COMMENT '图片说明',
    zhang_image VARCHAR(200) NOT NULL COMMENT '图片路径',
    zhang_place VARCHAR(80) NOT NULL DEFAULT '' COMMENT '拍摄地点',
    zhang_tag VARCHAR(30) NOT NULL DEFAULT '校园科技节' COMMENT '标签',
    zhang_publish_time DATETIME NOT NULL COMMENT '发布时间',
    zhang_sort INT NOT NULL DEFAULT 0 COMMENT '排序号（越小越靠前）',
    zhang_created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入库时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='校园图文表';

INSERT INTO zhang_gallery (zhang_title, zhang_desc, zhang_image, zhang_place, zhang_tag, zhang_publish_time, zhang_sort) VALUES
('机器人展台前，同学们围成一圈',
 '两台人形机器人与两台轮式机器人同台亮相，同学们举着手机记录机器人转身、挥手与巡线行走的瞬间，展台前始终排着长队。',
 'img/gallery-1.jpg', '实训中心一层展厅', '人工智能', '2026-11-08 10:20:00', 1),
('无人机编队点亮夜空',
 '夜幕降临，数百架无人机在操场上空依次升空，用光点拼出“科技节”字样，跑道边的同学一起举起手机，欢呼声盖过了螺旋桨的嗡鸣。',
 'img/gallery-2.jpg', '北区田径场', '低空经济', '2026-11-07 19:40:00', 2),
('实验室里的 AI 训练演示',
 '大屏上实时显示神经网络结构与损失曲线，讲解的同学指着屏幕解释卷积层的作用，观众第一次直观看到“模型是怎么学会的”。',
 'img/gallery-3.jpg', '人工智能实验室', '人工智能', '2026-11-07 15:10:00', 3),
('戴上头显，走进虚拟空间',
 'VR 体验区一直是最热闹的角落。体验者握着手柄在虚拟场景中移动，旁边的大屏同步播放第一视角画面，围观同学看得比体验者还投入。',
 'img/gallery-4.jpg', '虚拟现实体验区', '虚拟现实', '2026-11-06 14:30:00', 4),
('3D 打印：从图纸到实物',
 '齿轮组、蓝色小屋、粉色小熊，全部由 3D 打印机一层层堆叠而成。展台旁的打印机还在工作，喷头来回移动的声音吸引了不少同学驻足。',
 'img/gallery-5.jpg', '智能制造展台', '智能制造', '2026-11-06 11:05:00', 5),
('编程马拉松：九小时的坚持',
 '投影上的倒计时还剩 9 小时 52 分，长桌两侧的键盘声几乎没有停过。台灯、笔记本与插线板，构成了这场马拉松最真实的画面。',
 'img/gallery-6.jpg', '创新工坊', '编程赛事', '2026-11-05 20:15:00', 6);

SELECT COUNT(*) AS zhang_gallery_count FROM zhang_gallery;
