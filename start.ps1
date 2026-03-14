Write-Host "Starting ScrollSmart..."

# Start backend in a new window
Write-Host "Starting FastAPI backend on port 8000 in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; uvicorn main:app --reload --port 8000"

Start-Sleep -Seconds 2

# Start frontend in a new window
Write-Host "Starting Next.js frontend on port 3000 in a new window..."
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host ""
Write-Host "ScrollSmart is running in separate windows!"
Write-Host "   Frontend:  http://localhost:3000"
Write-Host "   Backend:   http://localhost:8000"
Write-Host "   API Docs:  http://localhost:8000/docs"
Write-Host ""
Write-Host "Close the newly opened windows to stop the servers."
