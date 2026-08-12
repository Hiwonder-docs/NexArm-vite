@echo off
chcp 65001 >nul 2>&1
setlocal enabledelayedexpansion

:: 配置参数
set "prefix=image"
set "target_suffix=.png"
:: 修改：包含 png 和 jpg/jpeg 格式
set "image_format=*.png *.jpg *.jpeg"
set "max_num=0"

echo ==============================================
echo 📁 图片自动递增命名脚本（支持JPG转PNG）
echo 📍 当前目录：%~dp0
echo 🔧 规则：读取JPG/PNG，统一命名为 image(X+1).png
echo 🛡️  安全模式：仅重命名新图，不覆盖/删除任何文件
echo ==============================================
echo.

:: 第一步：检测当前已有的「imagex.png」，获取最大编号
echo 🔍 正在检测已有的标准命名文件（%prefix%x%target_suffix%）...
for /f "delims=" %%f in ('dir /b /a-d %prefix%*%target_suffix%') do (
    set "filename=%%~nf"
    set "num=!filename:%prefix%=!"
    
    echo !num!|findstr /r "^[0-9][0-9]*$" >nul
    if !errorlevel! equ 0 (
        if !num! gtr !max_num! (
            set "max_num=!num!"
        )
    )
)
echo ✅ 当前最大编号为：!max_num!

:: 第二步：设置新图片的起始编号
set /a start_num=!max_num! + 1
echo.
echo 📌 新图片将从 image!start_num!!target_suffix! 开始编号
echo.

:: 第三步：筛选并处理所有图片
set "new_file_count=0"
:: 修改：按文件名顺序读取所有支持的格式
for /f "delims=" %%f in ('dir /b /a-d /o:n %image_format%') do (
    set "filename=%%~nf"
    set "file_ext=%%~xf"
    set "is_standard=0"
    
    :: 检查是否已经是符合规范的 .png 文件
    if /i "!file_ext!"=="!target_suffix!" (
        echo !filename!|findstr /r "^%prefix%[0-9][0-9]*$" >nul
        if !errorlevel! equ 0 (
            set "is_standard=1"
        )
    )
    
    :: 如果是非规范命名的 PNG，或是任何 JPG 文件，则进行重命名
    if !is_standard! equ 0 (
        set "new_name=!prefix!!start_num!!target_suffix!"
        
        if not exist "!new_name!" (
            ren "%%~f" "!new_name!"
            echo ✅ 处理中："%%~f" → "!new_name!"
            set /a start_num+=1
            set /a new_file_count+=1
        ) else (
            :: 预防编号冲突（如果 image(X+1).png 已存在则继续往后推）
            set /a start_num+=1
            echo ⚠️  跳过已存在的文件名，尝试下一个编号...
        )
    )
)

:: 第四步：输出最终结果
echo.
echo ==============================================
if !new_file_count! equ 0 (
    echo 📭 未检测到需要处理的图片（JPG 或 非标准命名的 PNG）。
) else (
    echo 🎉 命名完成！
    echo 📊 本次共转换并处理 %new_file_count% 张图片。
    echo 📌 新增范围：image!max_num!+1 到 image!start_num!-1
)
echo ==============================================
pause >nul
endlocal