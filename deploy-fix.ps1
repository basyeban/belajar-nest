Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CelenganKu - Deploy Fix CORS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Step 1: Deploy Backend
Write-Host "`n[1/3] Deploy backend (celenganku-api)..." -ForegroundColor Yellow
Set-Location "d:\belajar-nest"
vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Backend deploy gagal! Cek error di atas." -ForegroundColor Red
    exit 1
}
Write-Host "  Backend deployed OK" -ForegroundColor Green

# Step 2: Set environment variable for frontend
Write-Host "`n[2/3] Set NEXT_PUBLIC_API_URL di Vercel frontend..." -ForegroundColor Yellow
Set-Location "d:\belajar-nest\frontend"
vercel env rm NEXT_PUBLIC_API_URL production --yes 2>$null
echo "https://celenganku-api.vercel.app/api" | vercel env add NEXT_PUBLIC_API_URL production
Write-Host "  Env var set OK" -ForegroundColor Green

# Step 3: Deploy Frontend
Write-Host "`n[3/3] Deploy frontend (celenganku-sigma)..." -ForegroundColor Yellow
vercel --prod --yes
if ($LASTEXITCODE -ne 0) {
    Write-Host "  Frontend deploy gagal! Cek error di atas." -ForegroundColor Red
    exit 1
}
Write-Host "  Frontend deployed OK" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  SELESAI! Coba buka:" -ForegroundColor Green
Write-Host "  https://celenganku-sigma.vercel.app" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

