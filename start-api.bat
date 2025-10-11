@echo off
echo Starting Unified Geospatial Change Detection API...
echo.

cd /d "%~dp0dragonfly"

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo.
echo Installing/updating dependencies...
pip install -r requirements.txt

echo.
echo Starting API server...
echo API will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

python unified_api.py

pause
