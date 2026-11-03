# ==========================================
# CelenganKu - Deploy Script (Fix 404)
# Jalankan: .\DEPLOY_NOW.ps1
# ==========================================

Write-Host "`n[1/2] Deploy BACKEND ke Vercel..." -ForegroundColor Cyan
Set-Location "d:\belajar-nest"
vercel --prod --yes
Write-Host "Backend selesai." -ForegroundColor Green

Write-Host "`n[2/2] Deploy FRONTEND ke Vercel..." -ForegroundColor Cyan
Set-Location "d:\belajar-nest\frontend"
vercel --prod --yes
Write-Host "Frontend selesai." -ForegroundColor Green

Write-Host "`n✅ Selesai! Buka: https://celenganku-sigma.vercel.app" -ForegroundColor Green

