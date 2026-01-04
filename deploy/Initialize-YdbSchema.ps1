param (
    [switch]$DropIfExist
)

$ErrorActionPreference = "Stop"

$FOLDER_ID = "b1g4gkkorau936jmpgi4"
$REGISTRY_ID = "crp2ot8sddcki8cn0q9h"
$SERVICE_ACCOUNT_ID = "ajeevkq231jhcfteppn5"
$BACKEND_IMAGE = "cr.yandex/${REGISTRY_ID}/hall-of-questions-backend:latest"
$INITIALIZER_CONTAINER_NAME = "hall-of-questions-ydb-initializer" 

$BACKEND_INIT_YDB_ENDPOINT = "api/init-ydb"
$BACKEND_INIT_YDB_ENDPOINT_DROP_IF_EXIST_QUERY_PARAMETER = "dropIfExist"
$ASPNET_BACKEND_DLL_NAME = "HallOfQuestions.Backend.dll"
$ASPNET_MAP_INIT_YDB_ENDPOINT_ONLY_FLAG = "--init-ydb-endpoint-only"
$ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE = "ConnectionStrings__Ydb"
$YDB_CONNECTION_STRING = "Host=ydb.serverless.yandexcloud.net;Port=2135;Database=/ru-central1/b1galbfevin8h0bc0nht/etnouu3n4m119s1r2ajt"

Write-Host ""

Write-Host "Creating serverless initializer container if doesn't exist..."
$containerExists = yc serverless container get `
                    --name $INITIALIZER_CONTAINER_NAME `
                    --folder-id $FOLDER_ID `
                    --format json `
                    2>$null
                    
if (-not $containerExists) {
    yc serverless container create `
        --name $INITIALIZER_CONTAINER_NAME `
        --folder-id $FOLDER_ID
}

Write-Host "Deploying serverless initializer container revision..."
yc serverless container revision deploy `
    --container-name $INITIALIZER_CONTAINER_NAME `
    --image $BACKEND_IMAGE `
    --cores 1 `
    --memory 1024MB `
    --service-account-id $SERVICE_ACCOUNT_ID `
    --folder-id $FOLDER_ID `
    --environment "${ASPNET_YDB_CONNECTION_STRING_ENV_VARIABLE}=${YDB_CONNECTION_STRING}" `
    --command dotnet `
    --args $ASPNET_BACKEND_DLL_NAME `
    --args $ASPNET_MAP_INIT_YDB_ENDPOINT_ONLY_FLAG
       
Write-Host "Allowing unauthenticated serverless container invokes..." -ForegroundColor Yellow
yc serverless container allow-unauthenticated-invoke `
    --name $INITIALIZER_CONTAINER_NAME `
    --folder-id $FOLDER_ID
    
Write-Host "Triggering YDB initializer container using HTTP request..."
$uri = yc serverless container get `
    --name $INITIALIZER_CONTAINER_NAME `
    --format json `
    | ConvertFrom-Json `
    | Select-Object `
    -ExpandProperty url

$uri = "${uri}${$BACKEND_INIT_YDB_ENDPOINT}"
if ($DropIfExist) {
    $uri = $uri + "?${$BACKEND_INIT_YDB_ENDPOINT_DROP_IF_EXIST_QUERY_PARAMETER}=True"
}
Invoke-RestMethod -Uri "${uri}" -Method Post

Write-Host "Done" -ForegroundColor Green