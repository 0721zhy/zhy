# 接口记录（追加写入）

## 2026-11-09 初版创建

### /api/categories | GET | 无参数 | 2026-11-09

请求示例：`GET http://localhost:521/api/categories`

响应示例：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    { "zhang_id": 1, "zhang_name": "计算机技术", "zhang_desc": "编程语言、数据库、网络与软件开发类图书", "zhang_created_at": "2026-11-09T06:06:41.000Z" }
  ]
}
```

### /api/books | GET | query: keyword（可选，模糊匹配书名/作者）、categoryId（可选，分类ID） | 2026-11-09

请求示例：`GET http://localhost:521/api/books?keyword=MySQL&categoryId=1`

响应示例：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": [
    {
      "zhang_id": 2,
      "zhang_title": "MySQL 必知必会",
      "zhang_author": "本·福塔",
      "zhang_category_id": 1,
      "zhang_category_name": "计算机技术",
      "zhang_price": "49.80",
      "zhang_stock": 52,
      "zhang_press": "人民邮电出版社",
      "zhang_pub_date": "2020-08-01T00:00:00.000Z",
      "zhang_created_at": "2026-11-09T06:06:41.000Z"
    }
  ]
}
```

### /api/books/:id | GET | path: id（图书ID，示例 1） | 2026-11-09

请求示例：`GET http://localhost:521/api/books/1`

响应示例（成功）：

```json
{
  "code": 0,
  "msg": "查询成功",
  "data": {
    "zhang_id": 1,
    "zhang_title": "JavaScript 高级程序设计",
    "zhang_author": "马特·弗里斯比",
    "zhang_category_id": 1,
    "zhang_category_name": "计算机技术",
    "zhang_price": "129.00",
    "zhang_stock": 35,
    "zhang_press": "人民邮电出版社",
    "zhang_pub_date": "2022-05-01T00:00:00.000Z",
    "zhang_created_at": "2026-11-09T06:06:41.000Z"
  }
}
```

响应示例（不存在时）：`{ "code": 404, "msg": "图书不存在", "data": null }`

### /api/books | POST | body(JSON)：zhang_title*、zhang_author*、zhang_category_id*、zhang_price、zhang_stock、zhang_press、zhang_pub_date | 2026-11-09

请求示例：

```json
{ "zhang_title": "Node.js 实战", "zhang_author": "张海玉", "zhang_category_id": 1, "zhang_price": 79.00, "zhang_stock": 20, "zhang_press": "电子工业出版社", "zhang_pub_date": "2024-06-01" }
```

响应示例：`{ "code": 0, "msg": "新增成功", "data": { ...新增后的完整图书对象（含联表分类名）... } }`

必填缺失时：`{ "code": 400, "msg": "书名、作者、分类为必填项", "data": null }`

### /api/books/:id | PUT | path: id + body(JSON)：同 POST | 2026-11-09

请求示例：`PUT http://localhost:521/api/books/11` + `{"zhang_title":"测试图书-改","zhang_author":"张海玉","zhang_category_id":2,"zhang_price":88.8,"zhang_stock":18,"zhang_press":"测试出版社","zhang_pub_date":"2026-02-02"}`

响应示例：`{ "code": 0, "msg": "更新成功", "data": { ...更新后的完整图书对象... } }`

不存在或无变化时：`{ "code": 404, "msg": "图书不存在或未做任何修改", "data": null }`

### /api/books/:id | DELETE | path: id（图书ID） | 2026-11-09

请求示例：`DELETE http://localhost:521/api/books/11`

响应示例：`{ "code": 0, "msg": "删除成功", "data": null }`

不存在时：`{ "code": 404, "msg": "图书不存在", "data": null }`

---

## 2026-11-09 新增：数据库连接测试

### /api/database/test | POST | body(JSON)：zhang_user*、zhang_password*、zhang_host（默认 localhost）、zhang_port（默认 3306）、zhang_database | 2026-11-09

请求示例：

```json
{ "zhang_user": "mysql80", "zhang_password": "zhang0168", "zhang_host": "localhost", "zhang_port": 3306, "zhang_database": "zhang_book_db" }
```

响应示例（成功）：

```json
{ "code": 0, "msg": "连接成功", "data": { "zhang_user": "mysql80", "zhang_host": "localhost", "zhang_version": "8.0.43", "zhang_database": "zhang_book_db" } }
```

响应示例（密码错误）：

```json
{ "code": 1, "msg": "连接失败：Access denied for user 'mysql80'@'localhost' (using password: YES)", "data": { "zhang_error_code": "ER_ACCESS_DENIED_ERROR" } }
```

用户名称为空时：`{ "code": 400, "msg": "用户名不能为空", "data": null }`

补充（2026-11-09）：前端支持 用户名@主机 写法（如 root@localhost），提交前自动拆分为 zhang_user=root、zhang_host=localhost；实测该写法连接成功。


---

## 2026-11-09 新增：科技新闻接口

### /api/news | GET | query：keyword（标题/摘要模糊）、category | 2026-11-09

响应：`{ "code": 0, "msg": "查询成功", "data": [ { "zhang_id": 1, "zhang_title": "...", "zhang_summary": "...", "zhang_source": "科技日报", "zhang_category": "人工智能", "zhang_publish_time": "2026-11-08T01:30:00.000Z", "zhang_views": 1862 } ] }`

### /api/news/categories | GET | 返回分类数组：`{ "code": 0, "msg": "查询成功", "data": ["人工智能", "低空经济", ...] }` | 2026-11-09

### /api/news/:id | GET | 返回单条含正文 zhang_content，浏览量自动 +1；id 不存在时 `code=404, msg="新闻不存在"` | 2026-11-09

### /api/gallery | GET | query：tag（按标签筛选） | 2026-11-09

响应：`{ "code": 0, "msg": "查询成功", "data": [ { "zhang_id": 1, "zhang_title": "...", "zhang_desc": "...", "zhang_image": "img/gallery-1.jpg", "zhang_place": "实训中心一层展厅", "zhang_tag": "人工智能", "zhang_publish_time": "2026-11-08T02:20:00.000Z" } ] }`

### /api/gallery/tags | GET | `{ "code": 0, "msg": "查询成功", "data": ["人工智能","低空经济","智能制造","编程赛事","虚拟现实"] }` | 2026-11-09
