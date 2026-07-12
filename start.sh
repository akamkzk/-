#!/bin/bash
set -euo pipefail

# 个人博客系统 - 一键启动脚本 (Git Bash / WSL)
echo "========================================"
echo "  个人博客系统 - 一键启动"
echo "========================================"
echo ""

PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

BACKEND_PORT=8080
FRONTEND_PORT=5173

# === 检查 MySQL ===
echo "[1/4] 检查 MySQL..."
MYSQL_BIN=$(cygpath -w "/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe" 2>/dev/null || echo "")
if [ -n "$MYSQL_BIN" ]; then
    MYSQL_PWD="123456" "$MYSQL_BIN" -u root -e "SELECT 1" > /dev/null 2>&1
    echo "[OK] MySQL 连接正常"
else
    echo "[警告] 未找到 MySQL，请确保已安装并运行"
fi

# === 检查 Java ===
echo "[2/4] 检查 Java..."
if ! command -v java &> /dev/null; then
    echo "[错误] 未找到 Java，请安装 JDK 17 并配置 JAVA_HOME"
    exit 1
fi
echo "[OK] Java 环境正常"

# === 检查 Node.js ===
echo "[3/4] 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "[错误] 未找到 Node.js，请安装 Node.js 20+"
    exit 1
fi
echo "[OK] Node.js 环境正常"

# === 检查后端 JAR ===
echo "[4/4] 检查后端构建..."
if [ ! -f "$BACKEND_DIR/target/blog-platform-1.0.0.jar" ]; then
    echo "[提示] 后端 JAR 不存在，正在编译..."
    cd "$BACKEND_DIR"
    mvn clean package -DskipTests -q
    cd "$PROJECT_ROOT"
    echo "[OK] 后端编译完成"
else
    echo "[OK] 后端 JAR 已存在"
fi

echo ""
echo "========================================"
echo "  正在启动服务..."
echo "========================================"
echo ""

# === 关闭已占用的端口 ===
for port in $BACKEND_PORT $FRONTEND_PORT; do
    pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        echo "[提示] 端口 $port 已被占用 (PID: $pid)，正在关闭..."
        kill -9 $pid 2>/dev/null || true
        sleep 1
    fi
done

# === 启动后端 ===
echo ""
echo "[1/2] 启动后端服务 (http://localhost:$BACKEND_PORT)..."
cd "$PROJECT_ROOT"
java -jar "$BACKEND_DIR/target/blog-platform-1.0.0.jar" &
BACKEND_PID=$!
echo "  PID: $BACKEND_PID"

# 等待后端启动
sleep 5

# === 启动前端 ===
echo "[2/2] 启动前端服务 (http://localhost:$FRONTEND_PORT)..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
echo "  PID: $FRONTEND_PID"

echo ""
echo "========================================"
echo "  启动完成！"
echo "========================================"
echo ""
echo "  前端: http://localhost:$FRONTEND_PORT"
echo "  后端: http://localhost:$BACKEND_PORT"
echo "  数据库: MySQL localhost:3306/blog_platform"
echo ""
echo "  管理员账号: admin / admin123"
echo ""
echo "  按 Ctrl+C 停止所有服务"
echo ""

# 等待进程结束
wait
