@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: 配置参数（固定格式：imagex.png，仅处理PNG）
set "prefix=image"
set "suffix=.png"
set "image_format=*.png"
set "max_num=0"  :: 存储已有的最大编号

echo ==============================================
echo 📁 图片自动递增命名脚本（导入即按序编号）
echo 📍 当前目录：%~dp0
echo 🔧 规则：已有imageX，新图命名为image(X+1)
echo 🛡️  安全模式：仅重命名新图，不覆盖/删除任何文件
echo ==============================================
echo.

:: 第一步：检测当前已有的「imagex.png」，获取最大编号
echo 🔍 正在检测已有的命名文件（imagex.png）...
for /f "delims=" %%f in ('dir /b /a-d %prefix%*%suffix%') do (
    :: 提取文件名中的数字（如image3.png → 3）
    set "filename=%%~nf"
    set "num=!filename:%prefix%=!"  :: 去掉前缀image，剩下数字
    
    :: 验证提取的是否为纯数字（避免误判类似imageabc.png的文件）
    echo !num!|findstr /r "^[0-9][0-9]*$" >nul
    if !errorlevel! equ 0 (
        :: 更新最大编号
        if !num! gtr !max_num! (
            set "max_num=!num!"
        )
        echo ✅ 已识别：%%f（编号：!num!）
    )
)

:: 第二步：设置新图片的起始编号（最大编号+1，默认从1开始）
set /a start_num=!max_num! + 1
echo.
echo 📌 新图片起始编号：image!start_num!!suffix!
echo.

:: 第三步：筛选「新导入的未命名图片」（非imagex.png格式的PNG）
set "new_file_count=0"
for /f "delims=" %%f in ('dir /b /a-d /o:n %image_format%') do (
    :: 检查当前文件是否为已有的「imagex.png」（是则跳过）
    set "filename=%%~nf"
    set "is_existing=0"
    echo !filename!|findstr /r "^%prefix%[0-9][0-9]*$" >nul
    if !errorlevel! equ 0 (
        set "is_existing=1"
    )
    
    :: 仅处理新导入的非规则命名图片
    if !is_existing! equ 0 (
        set "new_name=!prefix!!start_num!!suffix!"
        
        :: 双重安全检查：避免意外覆盖（理论上不会发生）
        if not exist "!new_name!" (
            ren "%%~f" "!new_name!"
            echo ✅ 新图命名："%%~f" → "!new_name!"
            set /a start_num+=1
            set /a new_file_count+=1
        ) else (
            echo ⚠️  跳过："!new_name!" 已存在，当前文件：%%~f
        )
    )
)

:: 第四步：输出最终结果
echo.
echo ==============================================
if !new_file_count! equ 0 (
    echo 📭 未检测到新导入的未命名图片！
    echo 🔍 请确认：1.已导入新图片 2.新图片未按imagex.png命名
) else (
    echo 🎉 命名完成！
    echo 📊 共处理 %new_file_count% 张新图片
    echo 📌 新增命名：image!max_num!+1!!suffix! 至 image!start_num!-1!!suffix!
)
echo ==============================================
pause >nul
endlocal