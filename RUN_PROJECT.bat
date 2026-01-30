@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   FlowHub - Iniciando Projeto
echo ========================================
echo.
echo [1/2] Iniciando Backend (.NET 8)...
echo.
start cmd /k "cd /d %~dp0backend && echo Backend iniciando... && dotnet run"
timeout /t 5 /nobreak > nul
echo.
echo [2/2] Iniciando Frontend (React)...
echo.
start cmd /k "cd /d %~dp0frontend && echo Frontend iniciando... && npm run dev"
echo.
echo ========================================
echo   ✓ Projeto iniciado!
echo ========================================
echo.
echo Backend: http://localhost:5024
echo Frontend: http://localhost:5173
echo Swagger: https://localhost:7042/swagger
echo.
echo Aguarde alguns segundos e acesse:
echo http://localhost:5173
echo.
echo Credenciais de teste:
echo - expositor / 123456
echo - operador / 123456
echo - supervisor / 123456
echo - garcom / 123456
echo - admin / 123456
echo.
pause
