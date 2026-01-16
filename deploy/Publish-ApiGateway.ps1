. "$PSScriptRoot/Helpers.ps1"

$ErrorActionPreference = "Stop"

$YANDEX_CLOUD_FOLDER_ID = "b1g4gkkorau936jmpgi4"
$YANDEX_CLOUD_SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5" 

$YANDEX_API_GATEWAY_NAME = "hall-of-questions-gateway"
$BACKEND_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME = "hall-of-questions-backend"
$FRONTEND_YANDEX_OBJECT_STORAGE_BUCKET_NAME = "hall-of-questions-frontend"

$OPENAPI_SPECIFICATION_PATH = "openapi.yaml"

Write-Host "Getting serverless backend container ID..."
$BACKEND_SERVERLESS_CONTAINER_ID = Invoke-External yc serverless container get `
    --name $BACKEND_YANDEX_CLOUD_SERVERLESS_CONTAINER_NAME `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --format json `
    | ConvertFrom-Json `
    | Select-Object `
    -ExpandProperty id

Write-Host "Preparing OpenAPI specification in memory..."
$specContent = Get-Content -Path $OPENAPI_SPECIFICATION_PATH -Raw
$specContent = $specContent.Replace('${BACKEND_YANDEX_CLOUD_SERVERLESS_CONTAINER_ID}', $BACKEND_SERVERLESS_CONTAINER_ID)
$specContent = $specContent.Replace('${FRONTEND_YANDEX_OBJECT_STORAGE_BUCKET_NAME}', $FRONTEND_YANDEX_OBJECT_STORAGE_BUCKET_NAME)
$specContent = $specContent.Replace('${YANDEX_CLOUD_SERVICE_ACCOUNT_ID}', $YANDEX_CLOUD_SERVICE_ACCOUNT_ID)
$tempFilePath = [System.IO.Path]::GetTempFileName()

try {
    Set-Content -Path $tempFilePath -Value $specContent -Encoding UTF8
    $gatewayExists = Invoke-External yc serverless api-gateway list `
        --folder-id $YANDEX_CLOUD_FOLDER_ID `
        --format json `
        | ConvertFrom-Json `
        | Where-Object { $_.name -eq $YANDEX_API_GATEWAY_NAME }

    Write-Host "Creating API Gateway (or updating it if already exists)..."
    if (-not $gatewayExists) {
        Invoke-External yc serverless api-gateway create `
            --name $YANDEX_API_GATEWAY_NAME `
            --spec $tempFilePath `
            --folder-id $YANDEX_CLOUD_FOLDER_ID
    } else {
        Invoke-External yc serverless api-gateway update `
            --name $YANDEX_API_GATEWAY_NAME `
            --spec $tempFilePath `
            --folder-id $YANDEX_CLOUD_FOLDER_ID
    }

    $GATEWAY_URL = Invoke-External yc serverless api-gateway get `
        --name $YANDEX_API_GATEWAY_NAME `
        --folder-id $YANDEX_CLOUD_FOLDER_ID `
        --format json `
        | ConvertFrom-Json `
        | Select-Object `
        -ExpandProperty domain

    Write-Host "Done. Application should be available at: https://$GATEWAY_URL" -ForegroundColor Green
}
catch {
    Write-Error $_
}
finally {
    if (Test-Path $tempFilePath) {
        Remove-Item $tempFilePath -Force
    }
}