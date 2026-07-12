# 测试数据导入说明

## 生成的文件

### `backend/src/main/resources/seed_data.sql`
完整的测试数据 SQL 脚本，包含：
- **6 个用户**（admin + 5 个普通用户），密码统一为 `user123`
- **5 个分类**（技术分享、生活随笔、学习笔记、项目实战、读书笔记）
- **12 个标签**（Java、Spring Boot、MySQL、React、前端、Docker、Python、Vue、Redis、算法、Kubernetes、微服务）
- **10 篇文章**（含完整 HTML 内容，覆盖不同作者、分类、标签）
- **10 条文章标签关联**
- **17 条评论**（含嵌套回复）

## 导入方法

### 方法一：直接在数据库中执行
```bash
mysql -u root -p < backend/src/main/resources/seed_data.sql
```

### 方法二：通过 MySQL 客户端
```sql
USE blog_platform;
SOURCE D:/项目/毕业设计/YHY  TEST/backend/src/main/resources/seed_data.sql;
```

## 修改过的文件

### `backend/src/main/resources/schema.sql`
补充了两个实体类中缺失的字段：
- `users` 表新增 `nickname` 和 `last_login_at` 列
- `articles` 表新增 `reject_reason` 列，修正状态注释为 `PENDING/APPROVED/REJECTED/DRAFT`

## 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | admin123 | 管理员 |
| zhangwei | user123 | 普通用户 |
| lina | user123 | 普通用户 |
| wangfang | user123 | 普通用户 |
| chenming | user123 | 普通用户 |
| zhaoli | user123 | 普通用户 |
