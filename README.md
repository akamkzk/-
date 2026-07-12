# 个人博客管理系统

基于前后端分离的个人博客管理系统，Spring Boot + React + MySQL。

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | React 19 + Ant Design 6 + React Router 7 + TipTap |
| 后端 | Java 17 + Spring Boot 3.2 + Spring Security + JWT + MyBatis-Plus |
| 数据库 | MySQL 8.0 |
| 部署 | Docker + Docker Compose |

## 功能模块

- 用户注册/登录（JWT 认证）
- 博客文章 CRUD（草稿/发布状态）
- 文章分类管理
- 文章标签管理
- 文章搜索（按标题、分类、标签）
- 评论管理（用户评论 + 管理员审核/删除）
- TipTap 可视化富文本编辑器
- 首页文章列表展示
- 文章详情页

## 快速开始

### 方式一：Docker 一键部署（推荐）

```bash
# 1. 确保已安装 Docker Desktop
# 2. 在项目根目录执行
docker-compose up --build

# 等待所有服务启动后访问：
# 前端：http://localhost
# 后端 API：http://localhost:8080
# MySQL：localhost:3306 / root / root
```

默认管理员账号：
- 用户名：`admin`
- 密码：`admin123`

### 方式二：本地开发

#### 后端

```bash
# 1. 创建数据库
mysql -u root -p < backend/src/main/resources/schema.sql

# 2. 修改 backend/src/main/resources/application.yml 中的数据库连接信息

# 3. 启动后端
cd backend
mvn spring-boot:run
# 后端运行在 http://localhost:8080
```

#### 前端

```bash
# 1. 安装依赖
cd frontend
npm install

# 2. 启动开发服务器
npm run dev
# 前端运行在 http://localhost:5173
```

## 项目结构

```
blog-platform/
├── docker-compose.yml          # Docker 编排
├── backend/                    # Spring Boot 后端
│   ├── src/main/java/com/blog/
│   │   ├── BlogApplication.java
│   │   ├── config/             # 安全、跨域、MyBatis 配置
│   │   ├── controller/         # REST API 控制器
│   │   ├── service/            # 业务逻辑层
│   │   ├── mapper/             # 数据访问层
│   │   ├── entity/             # 实体类
│   │   ├── dto/                # 数据传输对象
│   │   ├── util/               # 工具类 (JWT)
│   │   └── security/           # JWT 过滤器
│   └── src/main/resources/
│       ├── application.yml
│       └── schema.sql          # 数据库建表 + 初始数据
├── frontend/                   # React 前端
│   ├── src/
│   │   ├── api/                # Axios 请求封装
│   │   ├── components/         # 通用组件
│   │   ├── pages/              # 页面
│   │   ├── store/              # 状态管理 (AuthContext)
│   │   └── router/             # 路由配置
│   └── Dockerfile
└── docker/
    └── nginx.conf              # Nginx 反向代理配置
```

## API 接口

| 方法 | 路径 | 说明 | 权限 |
|------|------|------|------|
| POST | /api/auth/register | 用户注册 | 公开 |
| POST | /api/auth/login | 用户登录 | 公开 |
| GET | /api/auth/me | 获取当前用户信息 | 登录 |
| PUT | /api/auth/profile | 更新个人信息 | 登录 |
| PUT | /api/auth/password | 修改密码 | 登录 |
| GET | /api/articles | 文章列表（分页） | 公开 |
| GET | /api/articles/latest | 最新文章 | 公开 |
| GET | /api/articles/:id | 文章详情 | 公开 |
| POST | /api/articles | 创建文章 | 登录 |
| PUT | /api/articles/:id | 更新文章 | 作者 |
| DELETE | /api/articles/:id | 删除文章 | 作者 |
| GET | /api/categories | 分类列表 | 公开 |
| POST | /api/categories | 创建分类 | 管理员 |
| PUT | /api/categories/:id | 更新分类 | 管理员 |
| DELETE | /api/categories/:id | 删除分类 | 管理员 |
| GET | /api/tags | 标签列表 | 公开 |
| POST | /api/tags | 创建标签 | 管理员 |
| PUT | /api/tags/:id | 更新标签 | 管理员 |
| DELETE | /api/tags/:id | 删除标签 | 管理员 |
| GET | /api/comments/public/:articleId | 文章评论列表 | 公开 |
| POST | /api/comments | 发表评论 | 登录 |
| GET | /api/comments/pending | 待审核评论 | 管理员 |
| PUT | /api/comments/:id/status | 审核评论 | 管理员 |
| DELETE | /api/comments/:id | 删除评论 | 管理员 |
