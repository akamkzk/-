-- ============================================
-- 博客平台测试数据初始化脚本
-- 使用前请确保已执行 schema.sql
-- ============================================

USE blog_platform;

-- ----------------------------
-- 1. 用户数据 (id: 1=admin, 2~6=普通用户)
-- ----------------------------
-- 密码统一为: user123 (BCrypt: $2a$10$N9qo8uLOickgx2ZMRZoMye...)
INSERT INTO `users` (`id`, `username`, `password`, `email`, `avatar`, `bio`, `role`, `created_at`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8KIsZpljHp12Yz9axWHtm4O8XP8Wm', 'admin@blog.com', '', '站长，热爱开源与技术分享', 'ADMIN', '2025-01-01 00:00:00'),
(2, 'zhangwei', '$2a$10$N9qo8uLOickgx2ZMRZoMyeYGDHJX8K3qRj1Z5vJ0yqGx0uZ5fG8Oy', 'zhangwei@example.com', '', '全栈开发者，喜欢折腾新技术', 'USER', '2025-02-10 10:00:00'),
(3, 'lina', '$2a$10$N9qo8uLOickgx2ZMRZoMyeYGDHJX8K3qRj1Z5vJ0yqGx0uZ5fG8Oy', 'lina@example.com', '', '前端爱好者，React & Vue 双修', 'USER', '2025-03-15 14:30:00'),
(4, 'wangfang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeYGDHJX8K3qRj1Z5vJ0yqGx0uZ5fG8Oy', 'wangfang@example.com', '', '在读研究生，研究方向为分布式系统', 'USER', '2025-04-20 09:00:00'),
(5, 'chenming', '$2a$10$N9qo8uLOickgx2ZMRZoMyeYGDHJX8K3qRj1Z5vJ0yqGx0uZ5fG8Oy', 'chenming@example.com', '', 'DevOps 工程师，Kubernetes 爱好者', 'USER', '2025-05-05 16:00:00'),
(6, 'zhaoli', '$2a$10$N9qo8uLOickgx2ZMRZoMyeYGDHJX8K3qRj1Z5vJ0yqGx0uZ5fG8Oy', 'zhaoli@example.com', '', '数据分析师，Python & SQL 日常', 'USER', '2025-06-12 11:00:00');

-- ----------------------------
-- 2. 分类数据 (id: 1~5)
-- ----------------------------
INSERT IGNORE INTO `categories` (`id`, `name`, `description`, `sort_order`) VALUES
(1, '技术分享', '技术相关文章', 1),
(2, '生活随笔', '日常生活记录', 2),
(3, '学习笔记', '学习过程中的笔记', 3),
(4, '项目实战', '实际项目经验总结', 4),
(5, '读书笔记', '读书心得与感悟', 5);

-- ----------------------------
-- 3. 标签数据 (id: 1~12)
-- ----------------------------
INSERT IGNORE INTO `tags` (`id`, `name`) VALUES
(1, 'Java'), (2, 'Spring Boot'), (3, 'MySQL'),
(4, 'React'), (5, '前端'), (6, 'Docker'),
(7, 'Python'), (8, 'Vue'), (9, 'Redis'),
(10, '算法'), (11, 'Kubernetes'), (12, '微服务');

-- ----------------------------
-- 4. 文章数据 (id: 1~10)
-- ----------------------------
INSERT INTO `articles` (`id`, `title`, `summary`, `content`, `cover_image`, `user_id`, `category_id`, `status`, `view_count`, `is_top`, `published_at`) VALUES
(1, 'Spring Boot 入门指南：从零搭建第一个 REST API', '本文带你从零开始搭建一个基于 Spring Boot 的 RESTful API 服务，涵盖项目初始化、基础配置、Controller 编写、数据库连接等核心步骤。',
'<h2>前言</h2><p>Spring Boot 是目前 Java 生态中最流行的 Web 框架之一，它通过"约定优于配置"的理念极大地简化了企业级应用的开发流程。</p><h2>环境准备</h2><p>首先需要安装 JDK 17 和 Maven 3.8+，推荐使用 IntelliJ IDEA 作为开发工具。</p><h2>创建项目</h2><p>访问 <a href="https://start.spring.io">start.spring.io</a>，选择 Spring Web 和 Spring Data JPA 依赖，生成项目骨架。</p><h2>编写第一个接口</h2><pre><code>@RestController\n@RequestMapping("/api/hello")\npublic class HelloController {\n    @GetMapping\n    public String hello() {\n        return "Hello, Spring Boot!";\n    }\n}</code></pre><h2>总结</h2><p>通过以上步骤，我们成功创建了一个可以工作的 REST API 服务。接下来可以继续添加数据库操作、安全认证等功能。</p>',
'', 1, 1, 'APPROVED', 1523, 1, '2025-06-01 10:00:00'),

(2, 'React 18 新特性深度解析', 'React 18 带来了并发渲染、自动批处理、Suspense SSR 等重大更新，本文将从源码角度逐一分析这些新特性的原理和使用场景。',
'<h2>React 18 革命性变化</h2><p>React 18 是近年来最大的版本更新，核心引入了并发（Concurrent）能力。</p><h2>自动批处理</h2><p>在 React 18 之前，只有 React 事件处理函数中的状态更新会被批量处理。现在，setTimeout、Promise、原生事件等中的所有状态更新都会被自动批处理。</p><h2>并发渲染</h2><p>React 18 可以通过优先级调度来中断和恢复渲染，这对于大型应用的性能优化至关重要。</p><h2>迁移指南</h2><p>大多数应用在升级到 React 18 时无需修改业务代码，只需调整入口文件的渲染方式即可。</p>',
'', 2, 4, 'APPROVED', 892, 0, '2025-06-05 14:00:00'),

(3, 'MySQL 索引优化实战：让查询速度提升 10 倍', '通过实际案例演示如何分析慢查询、理解执行计划、设计合适的索引策略，让你的 MySQL 查询性能获得质的飞跃。',
'<h2>为什么需要索引优化？</h2><p>随着数据量的增长，数据库查询性能会成为系统瓶颈。合理的索引设计可以将查询速度提升数倍甚至数十倍。</p><h2>慢查询分析</h2><p>开启慢查询日志，使用 EXPLAIN 分析执行计划，重点关注 type、key、rows 和 Extra 字段。</p><h2>索引设计原则</h2><p>最左前缀匹配、覆盖索引避免回表、区分度高的列优先建索引。避免在索引列上做函数运算或类型转换。</p><h2>实战案例</h2><p>某电商订单表原本查询耗时 3.2 秒，通过分析执行计划发现缺少复合索引，添加后降至 0.15 秒。</p>',
'', 3, 1, 'APPROVED', 1205, 0, '2025-06-10 09:30:00'),

(4, '周末去爬山：城市之外的风景', '周末和朋友去了郊区的 Mount Qingcheng，远离城市的喧嚣，感受大自然的美好。分享一些摄影技巧和登山装备推荐。',
'<h2>出发前的准备</h2><p>提前查好天气和路线，准备好登山杖、防晒用品和充足的饮用水。轻量化的背包能让旅途轻松很多。</p><h2>沿途风景</h2><p>山间的空气格外清新，沿途可以看到很多在城市里看不到的植物和鸟类。清晨的薄雾给山林增添了几分神秘感。</p><h2>登顶时刻</h2><p>经过四个小时的努力终于到达山顶，俯瞰群山连绵，所有的疲惫都在这一刻烟消云散。</p><h2>装备推荐</h2><p>一双好的登山鞋是最重要的投资，其次是速干衣和防风外套。新手不建议背太重的包。</p>',
'', 4, 2, 'APPROVED', 456, 0, '2025-06-15 16:00:00'),

(5, 'Docker 容器化部署完整教程', '从 Docker 基础概念到生产环境部署，本文涵盖了镜像构建、多阶段构建、Docker Compose 编排等实用技能。',
'<h2>什么是 Docker？</h2><p>Docker 是一种容器化技术，它将应用程序及其依赖打包成一个可移植的容器，确保在任何环境中都能一致运行。</p><h2>安装与配置</h2><p>在 Ubuntu 上可以通过 apt 安装，在 macOS 和 Windows 上推荐使用 Docker Desktop。</p><h2>编写 Dockerfile</h2><p>使用多阶段构建可以显著减小最终镜像的大小。第一阶段编译应用，第二阶段只保留运行时依赖。</p><h2>Docker Compose</h2><p>对于多容器应用，Docker Compose 提供了声明式的编排方案，一条命令即可启动整个应用栈。</p><h2>生产环境建议</h2><p>使用非 root 用户运行容器、限制资源使用、定期清理无用镜像和容器。</p>',
'', 5, 4, 'APPROVED', 768, 0, '2025-06-20 11:00:00'),

(6, 'Vue 3 + TypeScript 项目最佳实践', '分享在使用 Vue 3 组合式 API + TypeScript 开发大型项目过程中积累的最佳实践和避坑指南。',
'<h2>为什么选择 Vue 3 + TS？</h2><p>TypeScript 的类型系统可以在编译期发现大量潜在错误，配合 Vue 3 的组合式 API，可以写出更加健壮和可维护的代码。</p><h2>项目结构</h2><p>推荐按功能模块组织目录结构，每个模块包含组件、状态管理、API 调用和类型定义。</p><h2>类型定义</h2><p>使用 interface 定义数据结构，利用泛型编写可复用的工具函数，善用 TypeScript 的条件类型和映射类型。</p><h2>性能优化</h2><p>合理使用 computed 和 watch，避免不必要的响应式开销，使用 v-memo 减少重复渲染。</p>',
'', 3, 4, 'APPROVED', 634, 0, '2025-06-25 08:00:00'),

(7, 'Python 数据分析入门：Pandas 完全手册', '从零开始学习使用 Python 进行数据分析，涵盖 Pandas 的核心功能：DataFrame 操作、数据清洗、可视化等。',
'<h2>Pandas 是什么？</h2><p>Pandas 是 Python 最强大的数据处理库，提供了 DataFrame 这一核心数据结构，可以高效地进行数据操作和分析。</p><h2>数据读取</h2><p>支持读取 CSV、Excel、SQL 数据库、JSON 等多种格式的数据源。</p><h2>数据清洗</h2><p>处理缺失值、重复数据、异常值是数据分析的第一步。Pandas 提供了丰富的方法来完成这些任务。</p><h2>数据聚合</h2><p>使用 groupby 进行分组聚合，配合 pivot_table 制作透视表，可以快速发现数据中的规律。</p>',
'', 6, 3, 'APPROVED', 521, 0, '2025-07-01 13:00:00'),

(8, 'Redis 缓存策略与性能优化', '深入探讨 Redis 在 Web 应用中的各种缓存策略，包括缓存穿透、击穿、雪崩的解决方案，以及实际生产环境的调优经验。',
'<h2>为什么需要缓存？</h2><p>缓存是提升系统性能最有效的手段之一。通过将热点数据存放在内存中，可以大幅降低数据库的访问压力。</p><h2>缓存穿透</h2><p>查询不存在的数据时每次都会打到数据库。解决方案：布隆过滤器、缓存空值。</p><h2>缓存击穿</h2><p>热点 key 过期瞬间大量请求直达数据库。解决方案：互斥锁、永不过期的热点数据。</p><h2>缓存雪崩</h2><p>大量 key 同时过期导致数据库瞬间压力激增。解决方案：随机过期时间、多级缓存。</p>',
'', 1, 1, 'APPROVED', 945, 1, '2025-07-05 10:00:00'),

(9, '读《深入理解计算机系统》有感', '这本书被誉为 CS 领域的圣经，从程序员的视角重新审视计算机系统的运作原理。读完之后对内存管理、链接、网络通信有了全新的认识。',
'<h2>初识这本书</h2><p>第一次听说这本书是在大学一年级的计算机导论课上，教授说这本书值得每个程序员读三遍以上。</p><h2>信息就是位</h2><p>第一章就颠覆了我的认知——在计算机眼中，一切都是一连串的 0 和 1。理解这一点是理解后续所有内容的基础。</p><h2>程序是如何运行的</h2><p>从源代码到可执行文件，经历了预处理器、编译器、汇编器、链接器的处理。理解这个过程对调试和优化程序非常有帮助。</p><h2>内存层次结构</h2><p>缓存命中率的微小提升都可能带来巨大的性能提升。这本书让我重新审视了自己的代码习惯。</p>',
'', 4, 5, 'APPROVED', 312, 0, '2025-07-08 15:00:00'),

(10, 'Kubernetes 集群搭建与管理实战', '手把手教你搭建一个高可用的 Kubernetes 集群，包括节点规划、网络配置、持久化存储、监控告警等生产环境必备技能。',
'<h2>为什么选择 Kubernetes？</h2><p>Kubernetes 已经成为容器编排的事实标准，无论是公有云还是私有部署，K8s 都能提供强大的自动化运维能力。</p><h2>环境规划</h2><p>至少需要 3 个节点：1 个 Master + 2 个 Worker。每个节点至少 2 核 CPU 和 4GB 内存。</p><h2>安装 kubeadm</h2><p>使用 kubeadm 可以快速搭建集群。首先配置 Docker/Containerd 运行时，然后初始化 Master 节点。</p><h2>网络插件</h2><p>Calico 和 Flannel 是两个最常用的 CNI 插件。Calico 支持更精细的网络策略，适合生产环境。</p><h2>监控与日志</h2><p>推荐部署 Prometheus + Grafana 做监控，EFK (Elasticsearch + Fluentd + Kibana) 做日志收集。</p>',
'', 5, 4, 'APPROVED', 1087, 0, '2025-07-10 09:00:00');

-- ----------------------------
-- 5. 文章标签关联
-- ----------------------------
-- 文章 1: Spring Boot 入门 -> Java, Spring Boot
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (1, 1), (1, 2);
-- 文章 2: React 18 -> React, 前端
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (2, 4), (2, 5);
-- 文章 3: MySQL 索引 -> MySQL
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (3, 3);
-- 文章 4: 爬山 -> 生活
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (4, 2);
-- 文章 5: Docker -> Docker
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (5, 6);
-- 文章 6: Vue 3 -> Vue, 前端, React
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (6, 8), (6, 5), (6, 4);
-- 文章 7: Python -> Python
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (7, 7);
-- 文章 8: Redis -> Redis, MySQL
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (8, 9), (8, 3);
-- 文章 9: 读书笔记 -> 读书笔记
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (9, 5);
-- 文章 10: Kubernetes -> Kubernetes, Docker
INSERT INTO `article_tags` (`article_id`, `tag_id`) VALUES (10, 11), (10, 6);

-- ----------------------------
-- 6. 评论数据
-- ----------------------------
-- 文章 1 的评论
INSERT INTO `comments` (`id`, `content`, `article_id`, `user_id`, `parent_id`, `status`, `created_at`) VALUES
(1, '写得很好，对我帮助很大！', 1, 2, NULL, 'APPROVED', '2025-06-02 09:00:00'),
(2, '请问 Spring Security 怎么配置？', 1, 3, NULL, 'APPROVED', '2025-06-03 14:00:00'),
(3, '可以参考官方文档的安全章节，很详细。', 1, 1, 2, 'APPROVED', '2025-06-03 15:30:00'),
(4, '期待更多 Spring Boot 系列的文章！', 1, 5, NULL, 'APPROVED', '2025-06-05 10:00:00'),
-- 文章 2 的评论
(5, 'React 18 的并发特性确实强大，已经在新项目中使用。', 2, 3, NULL, 'APPROVED', '2025-06-06 11:00:00'),
(6, '自动批处理这个功能太实用了，以前经常手动做批处理。', 2, 4, NULL, 'APPROVED', '2025-06-07 09:00:00'),
-- 文章 3 的评论
(7, 'EXPLAIN 的分析方法很实用，学到了！', 3, 2, NULL, 'APPROVED', '2025-06-11 16:00:00'),
(8, '补充一下：还可以使用 pt-queries-digest 工具来分析慢查询。', 3, 5, NULL, 'APPROVED', '2025-06-12 10:00:00'),
-- 文章 5 的评论
(9, '多阶段构建确实能大幅减小镜像体积，亲测有效。', 5, 2, NULL, 'APPROVED', '2025-06-21 14:00:00'),
(10, '生产环境用 Docker Swarm 和 K8s 哪个更好？', 5, 6, NULL, 'APPROVED', '2025-06-22 09:00:00'),
(11, '小规模项目可以用 Swarm，复杂一点的建议上 K8s。', 5, 5, 10, 'APPROVED', '2025-06-22 11:00:00'),
-- 文章 8 的评论
(12, '缓存雪崩的解决方案很全面，收藏了！', 8, 3, NULL, 'APPROVED', '2025-07-06 08:00:00'),
(13, '布隆过滤器的实现有没有推荐的库？', 8, 2, NULL, 'APPROVED', '2025-07-06 14:00:00'),
(14, 'Redisson 提供了很好的布隆过滤器实现，推荐试试。', 8, 1, 13, 'APPROVED', '2025-07-06 15:00:00'),
-- 文章 10 的评论
(15, 'K8s 的学习曲线确实陡峭，但是值得。', 10, 2, NULL, 'APPROVED', '2025-07-11 10:00:00'),
(16, '请问 Master 节点故障怎么切换？', 10, 4, NULL, 'APPROVED', '2025-07-11 14:00:00'),
(17, '高可用集群至少需要 3 个 Master 节点，配合 etcd 可以做到自动故障转移。', 10, 5, 16, 'APPROVED', '2025-07-11 15:00:00');

-- ----------------------------
-- 重置自增 ID（可选，方便后续测试数据不冲突）
-- ----------------------------
ALTER TABLE `users` AUTO_INCREMENT = 100;
ALTER TABLE `articles` AUTO_INCREMENT = 50;
ALTER TABLE `comments` AUTO_INCREMENT = 100;
