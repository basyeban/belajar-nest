@echo off
echo ========================================
echo   CelenganKu - Deploy Fix 404
echo ========================================

echo.
echo [1/2] Deploy backend...
cd /d d:\belajar-nest
vercel --prod --yes
if %errorlevel% neq 0 (
    echo Backend deploy GAGAL!
    pause
    exit /b 1
)
echo Backend OK

echo.
echo [2/2] Deploy frontend...
cd /d d:\belajar-nest\frontend
vercel --prod --yes
if %errorlevel% neq 0 (
    echo Frontend deploy GAGAL!
    pause
    exit /b 1
)
echo Frontend OK

echo.
echo ========================================
echo   SELESAI! Buka:
echo   https://celenganku-sigma.vercel.app
echo ========================================
pause

