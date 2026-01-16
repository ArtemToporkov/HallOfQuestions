. "$PSScriptRoot/Helpers.ps1"

$ErrorActionPreference = "Stop"

$YANDEX_CLOUD_FOLDER_ID = "b1g4gkkorau936jmpgi4"
$YANDEX_CLOUD_SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5"
$YANDEX_CONTAINER_REGISTRY_ID = "crp7hsh5d124hgv5f4bg"

$IMAGE_NAME = "hall-of-questions-backend"
$IMAGE_TAG = "latest"
$CONTAINER_NAME = "hall-of-questions-backend"

$ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE = "ConnectionStrings__Ydb"
$YDB_CONNECTION_STRING = "Host=ydb.serverless.yandexcloud.net;Port=2135;Database=/ru-central1/b1galbfevin8h0bc0nht/etnouu3n4m119s1r2ajt"

Write-Host "Building Docker image..."
Invoke-External docker build `
    -t "cr.yandex/${YANDEX_CONTAINER_REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}" `
    -f ..\backend\Dockerfile ..\backend

Write-Host "Pushing Docker image..."
Invoke-External docker push "cr.yandex/${YANDEX_CONTAINER_REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}"

Write-Host "Creating backend serverless container if doesn't exist..."
$containerExists = Invoke-External yc serverless container list `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --format json `
    | ConvertFrom-Json `
    | Where-Object { $_.name -eq $CONTAINER_NAME }
if (-not $containerExists) {
    Invoke-External yc serverless container create `
        --name $CONTAINER_NAME `
        --folder-id $YANDEX_CLOUD_FOLDER_ID
}

Write-Host "Deploying serverless container revision..."
Invoke-External yc serverless container revision deploy `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --container-name $CONTAINER_NAME `
    --image "cr.yandex/${YANDEX_CONTAINER_REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}" `
    --cores 1 `
    --memory 1024MB `
    --concurrency 1 `
    --execution-timeout 30s `
    --service-account-id $YANDEX_CLOUD_SERVICE_ACCOUNT_ID `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --environment "${ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE}=${YDB_CONNECTION_STRING}"

Write-Host "Done" -ForegroundColor Green