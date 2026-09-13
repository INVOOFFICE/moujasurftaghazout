@echo off
chcp 65001 >nul
title MOUJA TAGHAZOUT - Local Server

set "PROJECT_DIR=D:\moujasurfschool.com"
set "PORT=8231"

:MENU
cls
echo.
echo ==========================================
echo       MOUJA TAGHAZOUT - LOCAL SERVER
echo ==========================================
echo.
echo   [1] Demarrer le serveur
echo   [2] Arreter le serveur
echo   [3] Verifier le serveur
echo   [4] Ouvrir le site
echo   [5] Quitter
echo.
set /p choice=Choisissez une option :

if "%choice%"=="1" goto START
if "%choice%"=="2" goto STOP
if "%choice%"=="3" goto STATUS
if "%choice%"=="4" goto OPEN
if "%choice%"=="5" goto END

echo.
echo Choix invalide.
timeout /t 2 >nul
goto MENU


:START
cls
echo Verification du serveur...

netstat -ano | findstr ":%PORT%" | findstr "LISTENING" >nul

if not errorlevel 1 (
    echo.
    echo Le serveur est deja en cours sur :
    echo http://localhost:%PORT%
    echo.
    pause
    goto MENU
)

echo.
echo Demarrage du serveur...

cd /d "%PROJECT_DIR%"

start "" /B python serve.py

timeout /t 3 >nul

netstat -ano | findstr ":%PORT%" | findstr "LISTENING" >nul

if not errorlevel 1 (
    echo.
    echo ==========================================
    echo Serveur demarre avec succes !
    echo http://localhost:%PORT%
    echo ==========================================
) else (
    echo.
    echo ERREUR : le serveur ne semble pas demarre.
)

echo.
pause
goto MENU


:STOP
cls
echo Recherche du serveur sur le port %PORT%...

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT%" ^| findstr "LISTENING"') do (
    echo Arret du processus %%a...
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo Serveur arrete.
echo.
pause
goto MENU


:STATUS
cls
echo Verification du serveur...

netstat -ano | findstr ":%PORT%" | findstr "LISTENING"

if errorlevel 1 (
    echo.
    echo [OFFLINE] Le serveur est arrete.
) else (
    echo.
    echo [ONLINE] Le serveur fonctionne :
    echo http://localhost:%PORT%
)

echo.
pause
goto MENU


:OPEN
cls

netstat -ano | findstr ":%PORT%" | findstr "LISTENING" >nul

if errorlevel 1 (
    echo.
    echo Le serveur est actuellement arrete.
    echo Demarrez-le d'abord avec l'option [1].
) else (
    echo.
    echo Ouverture du site...
    start "" "http://localhost:%PORT%"
)

echo.
timeout /t 2 >nul
goto MENU


:END
cls
echo.
echo Au revoir !
timeout /t 1 >nul
exit