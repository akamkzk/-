CREATE DATABASE IF NOT EXISTS blog_platform DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_platform;

-- 用户表
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    `password` VARCHAR(255) NOT NULL COMMENT '加密密码',
    `email` VARCHAR(100) DEFAULT '' COMMENT '邮箱',
    `avatar` VARCHAR(500) DEFAULT '' COMMENT '头像URL',
    `bio` VARCHAR(500) DEFAULT '' COMMENT '个人简介',
    `role` VARCHAR(20) DEFAULT 'USER' COMMENT '角色: ADMIN, USER',
    `nickname` VARCHAR(50) DEFAULT '' COMMENT '昵称',
    `last_login_at` VARCHAR(50) DEFAULT NULL COMMENT '最后登录时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 分类表
CREATE TABLE IF NOT EXISTS `categories` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '分类名称',
    `description` VARCHAR(200) DEFAULT '' COMMENT '分类描述',
    `sort_order` INT DEFAULT 0 COMMENT '排序',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='分类表';

-- 标签表
CREATE TABLE IF NOT EXISTS `tags` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='标签表';

-- 文章表
CREATE TABLE IF NOT EXISTS `articles` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `title` VARCHAR(200) NOT NULL COMMENT '文章标题',
    `summary` VARCHAR(500) DEFAULT '' COMMENT '文章摘要',
    `content` LONGTEXT NOT NULL COMMENT '文章内容(HTML)',
    `cover_image` VARCHAR(500) DEFAULT '' COMMENT '封面图',
    `user_id` BIGINT NOT NULL COMMENT '作者ID',
    `category_id` BIGINT DEFAULT NULL COMMENT '分类ID',
    `status` VARCHAR(20) DEFAULT 'DRAFT' COMMENT '状态: PENDING, APPROVED, REJECTED, DRAFT',
    `reject_reason` VARCHAR(500) DEFAULT NULL COMMENT '拒绝原因',
    `view_count` INT DEFAULT 0 COMMENT '浏览量',
    `is_top` TINYINT(1) DEFAULT 0 COMMENT '是否置顶',
    `published_at` DATETIME DEFAULT NULL COMMENT '发布时间',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章表';

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS `article_tags` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `article_id` BIGINT NOT NULL,
    `tag_id` BIGINT NOT NULL,
    UNIQUE KEY `uk_article_tag` (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='文章标签关联表';

-- 评论表
CREATE TABLE IF NOT EXISTS `comments` (
    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
    `content` TEXT NOT NULL COMMENT '评论内容',
    `article_id` BIGINT NOT NULL COMMENT '文章ID',
    `user_id` BIGINT NOT NULL COMMENT '评论者ID',
    `parent_id` BIGINT DEFAULT NULL COMMENT '父评论ID(回复)',
    `status` VARCHAR(20) DEFAULT 'PENDING' COMMENT '状态: PENDING, APPROVED, REJECTED',
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (`article_id`) REFERENCES `articles`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
    FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='评论表';

-- 初始化管理员账户 (密码: admin123, BCrypt加密)
INSERT INTO `users` (`username`, `password`, `email`, `role`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8KIsZpljHp12Yz9axWHtm4O8XP8Wm', 'admin@blog.com', 'ADMIN');

-- 初始化示例数据
INSERT INTO `categories` (`name`, `description`, `sort_order`) VALUES
('技术分享', '技术相关文章', 1),
('生活随笔', '日常生活记录', 2),
('学习笔记', '学习过程中的笔记', 3);

INSERT INTO `tags` (`name`) VALUES
('Java'), ('Spring Boot'), ('MySQL'), ('React'), ('前端'), ('Docker');
