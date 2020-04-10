echo "Started: `date`"

aws cloudformation deploy --template-file cloudformation.yaml --stack-name aiofeed-frontend

set -e

npm run build

aws s3 sync --delete ./build s3://aiofeed.com

echo "Done: `date`"
