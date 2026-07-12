# 个人博客系统 - 一键启动 (PowerShell)
# 用法: .\start.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  个人博客系统 - 一键启动" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$PROJECT_ROOT = $PSScriptRoot
$BACKEND_DIR = Join-Path $PROJECT_ROOT "backend"
$FRONTEND_DIR = Join-Path $PROJECT_ROOT "frontend"
$BACKEND_PORT = 8080
$FRONTEND_PORT = 5173

# === 检查 MySQL ===
Write-Host "[1/4] 检查 MySQL..." -ForegroundColor Yellow
$MYSQL_CMD = "/c/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe"
if (Test-Path $MYSQL_CMD) {
    $result = & $MYSQL_CMD -u root -p123456 -e "SELECT 1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] MySQL 连接正常" -ForegroundColor Green
    } else {
        Write-Host "[警告] MySQL 连接失败，请确保 MySQL 正在运行" -ForegroundColor DarkYellow
    }
} else {
    Write-Host "[警告] 未找到 MySQL 客户端" -ForegroundColor DarkYellow
}

# === 检查 Java ===
Write-Host "[2/4] 检查 Java 环境..." -ForegroundColor Yellow
try {
    $javaVer = java -version 2>&1 | Select-String "version"
    Write-Host "[OK] Java 环境正常" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未找到 Java，请安装 JDK 17 并配置 JAVA_HOME" -ForegroundColor Red
    pause
    exit 1
}

# === 检查 Node.js ===
Write-Host "[3/4] 检查 Node.js 环境..." -ForegroundColor Yellow
try {
    $nodeVer = node -v
    Write-Host "[OK] Node.js 环境正常" -ForegroundColor Green
} catch {
    Write-Host "[错误] 未找到 Node.js，请安装 Node.js 20+" -ForegroundColor Red
    pause
    exit 1
}

# === 检查后端 JAR ===
Write-Host "[4/4] 检查后端构建..." -ForegroundColor Yellow
$JAR_PATH = Join-Path $BACKEND_DIR "target\blog-platform-1.0.0.jar"
if (-not (Test-Path $JAR_PATH)) {
    Write-Host "[提示] 后端 JAR 不存在，正在使用 Maven 编译打包..." -ForegroundColor Cyan
    Push-Location $BACKEND_DIR
    mvn clean package -DskipTests -q
    Pop-Location
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[错误] 后端编译失败" -ForegroundColor Red
        pause
        exit 1
    }
    Write-Host "[OK] 后端编译完成" -ForegroundColor Green
} else {
    Write-Host "[OK] 后端 JAR 已存在" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  正在启动服务..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# === 关闭已占用的端口 ===
foreach ($port in $BACKEND_PORT, $FRONTEND_PORT) {
    $proc = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($proc) {
        Write-Host "[提示] 端口 $port 已被占用 (PID: $($proc.OwningProcess))，正在关闭..." -ForegroundColor DarkYellow
        Stop-Process -Id $proc.OwningProcess -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# === 启动后端 ===
Write-Host ""
Write-Host "[1/2] 启动后端服务 (http://localhost:$BACKEND_PORT)..." -ForegroundColor Cyan
$backendProc = Start-Process -FilePath "java" -ArgumentList "-jar", $JAR_PATH -PassThru -WindowStyle Minimized
Write-Host "  PID: $($backendProc.Id)" -ForegroundColor Gray
Start-Sleep -Seconds 5

# === 启动前端 ===
Write-Host "[2/2] 启动前端服务 (http://localhost:$FRONTEND_PORT)..." -ForegroundColor Cyan
$frontendProc = Start-Process -FilePath "cmd" -ArgumentList "/k", "cd /d `"$FRONTEND_DIR`" && npm run dev" -PassThru -WindowStyle Minimized
Write-Host "  PID: $($frontendProc.Id)" -ForegroundColor Gray

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  启动完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "  前端: http://localhost:$FRONTEND_PORT" -ForegroundColor White
Write-Host "  后端: http://localhost:$BACKEND_PORT" -ForegroundColor White
Write-Host "  数据库: MySQL localhost:3306/blog_platform" -ForegroundColor White
Write-Host ""
Write-Host "  管理员账号: admin / admin123" -ForegroundColor White
Write-Host ""
Write-Host "  最小化窗口可后台运行" -ForegroundColor Gray
Write-Host "  关闭窗口可停止对应服务" -ForegroundColor Gray
