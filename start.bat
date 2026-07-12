@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ========================================
echo   个人博客系统 - 一键启动
echo ========================================
echo.

REM === 配置项 ===
set BACKEND_PORT=8080
set FRONTEND_PORT=5173
set JAVA_CMD=java
set MVN_CMD=mvn
set NODE_CMD=npm
set MYSQL_CMD="/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe"

REM === 检查 MySQL ===
echo [1/4] 检查 MySQL 服务...
"%MYSQL_CMD%" -u root -p123456 -e "SELECT 1" >nul 2>&1
if %errorlevel% neq 0 (
    echo [警告] MySQL 连接失败，请确保 MySQL 正在运行
    echo        数据库密码: 123456
    echo.
) else (
    echo [OK] MySQL 连接正常
)

REM === 检查 Java ===
echo [2/4] 检查 Java 环境...
%JAVA_CMD% -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Java，请安装 JDK 17 并配置 JAVA_HOME
    pause
    exit /b 1
)
echo [OK] Java 环境正常

REM === 检查 Node.js ===
echo [3/4] 检查 Node.js 环境...
%NODE_CMD% -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未找到 Node.js，请安装 Node.js 20+
    pause
    exit /b 1
)
echo [OK] Node.js 环境正常

REM === 检查后端 JAR ===
echo [4/4] 检查后端构建产物...
if not exist "backend\target\blog-platform-1.0.0.jar" (
    echo [提示] 后端 JAR 不存在，正在使用 Maven 编译打包...
    cd backend
    %MVN_CMD% clean package -DskipTests -q
    if %errorlevel% neq 0 (
        echo [错误] 后端编译失败
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo [OK] 后端编译完成
) else (
    echo [OK] 后端 JAR 已存在
)

echo.
echo ========================================
echo   正在启动服务...
echo ========================================
echo.

REM === 检查端口占用 ===
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%BACKEND_PORT%') do (
    echo [提示] 端口 %BACKEND_PORT% 已被占用 (PID: %%a)，正在关闭...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :%FRONTEND_PORT%') do (
    echo [提示] 端口 %FRONTEND_PORT% 已被占用 (PID: %%a)，正在关闭...
    taskkill /F /PID %%a >nul 2>&2
    timeout /t 2 /nobreak >nul
)

REM === 启动后端 ===
echo.
echo [1/2] 启动后端服务 (Spring Boot :%BACKEND_PORT%)...
start "Blog Backend" cmd /k "%JAVA_CMD% -jar backend\target\blog-platform-1.0.0.jar"
timeout /t 5 /nobreak >nul

REM === 启动前端 ===
echo [2/2] 启动前端服务 (Vite :%FRONTEND_PORT%)...
start "Blog Frontend" cmd /k "cd frontend && %NODE_CMD% run dev"

echo.
echo ========================================
echo   启动完成！
echo ========================================
echo.
echo   前端: http://localhost:%FRONTEND_PORT%
echo   后端: http://localhost:%BACKEND_PORT%
echo   数据库: MySQL localhost:3306/blog_platform
echo.
echo   管理员账号: admin / admin123
echo.
echo   关闭窗口可停止对应服务
echo   按任意键退出...
pause >nul
