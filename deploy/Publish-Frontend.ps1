$ErrorActionPreference = "Stop"

$YANDEX_CLOUD_FOLDER_ID = "b1g4gkkorau936jmpgi4"
$YANDEX_OBJECT_STORAGE_BUCKET_NAME = "hall-of-questions-frontend"

Write-Host "Building frontend..."
Push-Location ..\frontend
npm install
npm run build
Pop-Location

Write-Host "Removing old frontend version from Object Storage..."
yc storage s3 rm s3://$YANDEX_OBJECT_STORAGE_BUCKET_NAME --recursive

Write-Host "Uploading to Object Storage with explicit MIME types..."
$FULL_DIST_PATH = (Resolve-Path ..\frontend\dist).Path
Get-ChildItem $FULL_DIST_PATH -Recurse -File | ForEach-Object {
    $KEY = $_.FullName.Substring($FULL_DIST_PATH.Length + 1).Replace('\','/')
    $EXTENSION = $_.Extension.ToLower()
    $CONTENT_TYPE = switch ($EXTENSION) {
        ".html" { "text/html" }
        ".js"   { "application/javascript" }
        ".css"  { "text/css" }
        ".svg"  { "image/svg+xml" }
        default { "application/octet-stream" }
    }
    yc storage s3 cp $_.FullName "s3://$YANDEX_OBJECT_STORAGE_BUCKET_NAME/$KEY" --content-type $CONTENT_TYPE
}

Write-Host "Configuring website settings..."
yc storage bucket update `
    --name $YANDEX_OBJECT_STORAGE_BUCKET_NAME `
    --folder-id $YANDEX_CLOUD_FOLDER_ID `
    --website-settings '{\"index\": \"index.html\", \"error\": \"index.html\"}' `
    --public-read

Write-Host "Done. Frontend should be available at https://${YANDEX_OBJECT_STORAGE_BUCKET_NAME}.website.yandexcloud.net" -ForegroundColor Green