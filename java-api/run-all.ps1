Write-Host "Starting all microservices..." -ForegroundColor Green

function Start-Service {
    param (
        [string]$ServiceName,
        [string]$ServicePath
    )

    Write-Host "Starting $ServiceName..." -ForegroundColor Yellow

    Start-Process powershell `
        -ArgumentList "-NoExit", "-Command", "cd $ServicePath; mvn spring-boot:run" `
        -WindowStyle Normal
}

# 1️⃣ Eureka Server
Start-Service "Eureka Server" "eureka-server"

Start-Sleep -Seconds 10

# 2️⃣ Auth Service
Start-Service "Auth Service" "auth-service"
Start-Sleep -Seconds 5

# 3️⃣ Problem Service
Start-Service "Problem Service" "cjs-service"

Start-Sleep -Seconds 5

# 4️⃣ API Gateway
Start-Service "API Gateway" "api-gateway"
Start-Sleep -Seconds 5

Start-Service "MCQ-service" "mcq-service"

Write-Host "All services started!" -ForegroundColor Green
Write-Host "Eureka Dashboard: http://localhost:8761"
Write-Host "API Gateway: http://localhost:8080"
