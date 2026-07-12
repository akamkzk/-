-- 修复可能损坏的头像路径（/uploads/uploads → /uploads）
USE blog_platform;

UPDATE users SET avatar = REPLACE(avatar, '/uploads/uploads', '/uploads')
WHERE avatar LIKE '%/uploads/uploads%';
