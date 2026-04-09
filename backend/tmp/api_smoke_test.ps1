$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Net.Http

Set-Location 'c:\Desktop\MSME\backend'

if (!(Test-Path '.\tmp')) {
    New-Item -ItemType Directory -Path '.\tmp' | Out-Null
}

Set-Content -Path '.\tmp\sample.ppt' -Value 'fake ppt content'

$stamp = (Get-Date).ToString('yyyyMMddHHmmssfff')
$guid = ([guid]::NewGuid().ToString('N')).Substring(0, 8)
$teamName = "Team API Smoke $stamp $guid"
$leaderEmail = "lead.$stamp.$guid@example.com"
$memberEmail = "member.$stamp.$guid@example.com"
$rollNo = "R$stamp$guid"
$leaderPhone = "7$($stamp.Substring($stamp.Length - 9))"
$memberPhone = "8$($stamp.Substring($stamp.Length - 9))"

$leaderPayload = @{
    name = 'Lead One'
    email = $leaderEmail
    phone = $leaderPhone
    password = 'P@ssword123'
    confirmPassword = 'P@ssword123'
    teamName = $teamName
    collegeId = 'MSME-001'
} | ConvertTo-Json -Depth 5

$leader = Invoke-RestMethod -Method POST -Uri 'http://localhost:8080/api/auth/register/team-lead' -ContentType 'application/json' -Body $leaderPayload
Write-Output ("RegisteredLeaderId=$($leader.userId)")

$payload = @{
    leaderId = [int64]$leader.userId
    teamName = $teamName
    members = @(
        @{
            name = 'Lead One'
            email = $memberEmail
            mobile = $memberPhone
            gender = 'Male'
            college = 'MSME College'
            course = 'BTech'
            rollno = $rollNo
        }
    )
} | ConvertTo-Json -Depth 5

$team = Invoke-RestMethod -Method POST -Uri 'http://localhost:8080/api/teams' -ContentType 'application/json' -Body $payload
Write-Output ("CreatedTeamId=$($team.teamId)")

$appJson = @{
    teamId = [int64]$team.teamId
    problemId = 1
    abstractText = 'Smoke test abstract for full flow validation.'
    submissionVersion = 'v1.0'
} | ConvertTo-Json -Compress

$client = New-Object System.Net.Http.HttpClient

function Submit-Application([string]$jsonPayload, [string]$filePath) {
    $content = New-Object System.Net.Http.MultipartFormDataContent

    $jsonContent = New-Object System.Net.Http.StringContent($jsonPayload, [System.Text.Encoding]::UTF8, 'application/json')
    $content.Add($jsonContent, 'application')

    $fileBytes = [System.IO.File]::ReadAllBytes($filePath)
    $byteArrayContent = New-Object System.Net.Http.ByteArrayContent -ArgumentList (, $fileBytes)
    $byteArrayContent.Headers.ContentType = New-Object System.Net.Http.Headers.MediaTypeHeaderValue('application/vnd.ms-powerpoint')
    $content.Add($byteArrayContent, 'file', 'sample.ppt')

    return $client.PostAsync('http://localhost:8080/api/applications', $content).Result
}

$firstResponse = Submit-Application -jsonPayload $appJson -filePath 'c:\Desktop\MSME\backend\tmp\sample.ppt'
$firstBody = $firstResponse.Content.ReadAsStringAsync().Result
Write-Output ("FirstSubmissionStatus=$([int]$firstResponse.StatusCode)")
Write-Output ("FirstSubmissionBody=$firstBody")

$duplicateResponse = Submit-Application -jsonPayload $appJson -filePath 'c:\Desktop\MSME\backend\tmp\sample.ppt'
$duplicateBody = $duplicateResponse.Content.ReadAsStringAsync().Result
Write-Output ("DuplicateSubmissionStatus=$([int]$duplicateResponse.StatusCode)")
Write-Output ("DuplicateSubmissionBody=$duplicateBody")
