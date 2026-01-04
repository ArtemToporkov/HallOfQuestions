$ErrorActionPreference = "Stop"

$FOLDER_ID = "b1g4gkkorau936jmpgi4"
$SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5" 
$GATEWAY_NAME = "hall-of-questions-gateway"
$BACKEND_SERVERLESS_CONTAINER_NAME = "hall-of-questions-backend"
$FRONTEND_OBJECT_STORAGE_BUCKET_NAME = "hall-of-questions-frontend"
$OPENAPI_SPECIFICATION_PATH = "openapi.yaml"

Write-Host "Getting serverless backend container ID..."
$BACKEND_SERVERLESS_CONTAINER_ID = yc serverless container get `
                    --name $BACKEND_SERVERLESS_CONTAINER_NAME `
                    --folder-id $FOLDER_ID `
                    --format json `
                    | ConvertFrom-Json `
                    | Select-Object `
                    -ExpandProperty id

Write-Host "Preparing OpenAPI specification in memory..."
$specContent = Get-Content -Path $OPENAPI_SPECIFICATION_PATH -Raw
$specContent = $specContent.Replace('${BACKEND_SERVERLESS_CONTAINER_ID}', $BACKEND_SERVERLESS_CONTAINER_ID)
$specContent = $specContent.Replace('${FRONTEND_OBJECT_STORAGE_BUCKET_NAME}', $FRONTEND_OBJECT_STORAGE_BUCKET_NAME)
$specContent = $specContent.Replace('${SERVICE_ACCOUNT_ID}', $SERVICE_ACCOUNT_ID)
$tempFilePath = [System.IO.Path]::GetTempFileName()

try {
    Set-Content -Path $tempFilePath -Value $specContent -Encoding UTF8
    $gatewayExists = yc serverless api-gateway get `
                        --name $GATEWAY_NAME `
                        --folder-id $FOLDER_ID `
                        --format json `
                        2>$null

    Write-Host "Creating API Gateway (or updating it if already exists)..."
    if (-not $gatewayExists) {
        yc serverless api-gateway create `
            --name $GATEWAY_NAME `
            --spec $tempFilePath `
            --folder-id $FOLDER_ID
    } else {
        yc serverless api-gateway update `
            --name $GATEWAY_NAME `
            --spec $tempFilePath `
            --folder-id $FOLDER_ID
    }

    $GATEWAY_URL = yc serverless api-gateway get `
                    --name $GATEWAY_NAME `
                    --folder-id $FOLDER_ID `
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