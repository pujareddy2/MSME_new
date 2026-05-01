#!/usr/bin/env pwsh
# Login Credentials Verification Test

Write-Host "Login Test Starting..." -ForegroundColor Cyan

$baseUri = "http://localhost:8080/api/auth/login"
$headers = @{"Content-Type" = "application/json"}
$passCount = 0
$failCount = 0

# Test 1: EVALUATOR Email
Write-Host "Testing EVALUATOR (Email)..." -ForegroundColor Yellow
$body = @{email="evaluator@platform.local"; password="8004254595"; role="EVALUATOR"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ EVALUATOR Email: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ EVALUATOR Email: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 2: EVALUATOR Phone
Write-Host "Testing EVALUATOR (Phone)..." -ForegroundColor Yellow
$body = @{email="9000000001"; password="8004254595"; role="EVALUATOR"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ EVALUATOR Phone: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ EVALUATOR Phone: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 3: JUDGE
Write-Host "Testing JUDGE..." -ForegroundColor Yellow
$body = @{email="judge@platform.local"; password="8004254595"; role="JUDGE"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ JUDGE: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ JUDGE: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 4: MENTOR
Write-Host "Testing MENTOR..." -ForegroundColor Yellow
$body = @{email="mentor@platform.local"; password="8004254595"; role="MENTOR"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ MENTOR: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ MENTOR: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 5: EVENT_HEAD
Write-Host "Testing EVENT_HEAD..." -ForegroundColor Yellow
$body = @{email="eventhead@platform.local"; password="8004254595"; role="EVENT_HEAD"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ EVENT_HEAD: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ EVENT_HEAD: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 6: COLLEGE_SPOC
Write-Host "Testing COLLEGE_SPOC..." -ForegroundColor Yellow
$body = @{email="spoc@platform.local"; password="8004254595"; role="COLLEGE_SPOC"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ COLLEGE_SPOC: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ COLLEGE_SPOC: FAIL" -ForegroundColor Red
    $failCount++
}

# Test 7: ADMIN
Write-Host "Testing ADMIN..." -ForegroundColor Yellow
$body = @{email="admin@platform.local"; password="8004254595"; role="ADMIN"} | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri $baseUri -Method Post -Body $body -Headers $headers -UseBasicParsing
    Write-Host "✓ ADMIN: PASS" -ForegroundColor Green
    $passCount++
} catch {
    Write-Host "✗ ADMIN: FAIL" -ForegroundColor Red
    $failCount++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Passed: $passCount | Failed: $failCount" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
