$ErrorActionPreference = "Stop"

$FOLDER_ID = "b1g4gkkorau936jmpgi4"
$REGISTRY_ID = "crp2ot8sddcki8cn0q9h"
$IMAGE_NAME = "hall-of-questions-backend"
$IMAGE_TAG = "latest"
$CONTAINER_NAME = "hall-of-questions-backend"
$SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5"
$YDB_ASPNET_CONNECTION_STRING_ENV_VARIABLE = "ConnectionStrings__Ydb"
$YDB_CONNECTION_STRING = "Host=ydb.serverless.yandexcloud.net;Port=2135;Database=/ru-central1/b1galbfevin8h0bc0nht/etnouu3n4m119s1r2ajt"

Write-Host "Building Docker image..."
docker build `
    -t "cr.yandex/${REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}" `
    -f ..\backend\Dockerfile ..\backend

Write-Host "Pushing Docker image..."
docker push "cr.yandex/${REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}"

Write-Host "Creating backend serverless container if doesn't exist..."
$containerExists = yc serverless container get `
                        --name $CONTAINER_NAME `
                        --folder-id $FOLDER_ID `
                        --format json `
                        2>$null
if (-not $containerExists) {
    yc serverless container create `
        --name $CONTAINER_NAME `
        --folder-id $FOLDER_ID
}

Write-Host "Deploying serverless container revision..."
yc serverless container revision deploy `
    --container-name $CONTAINER_NAME `
    --image "cr.yandex/${REGISTRY_ID}/${IMAGE_NAME}:${IMAGE_TAG}" `
    --cores 1 `
    --memory 1024MB `
    --concurrency 4 `
    --execution-timeout 30s `
    --service-account-id $SERVICE_ACCOUNT_ID `
    --folder-id $FOLDER_ID `
    --environment "${YDB_ASPNET_CONNECTION_STRING_ENV_VARIABLE}=${YDB_CONNECTION_STRING}"

Write-Host "Done" -ForegroundColor Green